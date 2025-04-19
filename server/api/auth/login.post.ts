import { adminAuth, adminDb } from "~/server/units/firebase-admin";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  // 1. التحقق من صحة البيانات المدخلة
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "البريد الإلكتروني وكلمة المرور مطلوبان."
    });
  }

  // 1.1 التحقق من صيغة البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      message: "صيغة البريد الإلكتروني غير صحيحة."
    });
  }

  try {
    // 2. المصادقة باستخدام Firebase Identity Toolkit API
    const FIREBASE_API_KEY = useRuntimeConfig().apiKey;

    const response = await $fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        body: {
          email,
          password,
          returnSecureToken: true
        }
      }
    );

    const { idToken, refreshToken, localId: uid } = response;

    // 3. إنشاء session cookie صالح لمدة 7 أيام
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 7 * 24 * 60 * 60 * 1000 // 7 أيام بالملي ثانية
    });
    
    // 4. تخزين الكوكي الآمن
    setCookie(event, '__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 أيام بالثواني
    });

    // 5. جلب بيانات الطالبمن Firestore
    const userSnapshot = await adminDb
      .collection('users')
      .where('uid', '==', uid)
      .get();

    if (userSnapshot.empty) {
      throw createError({
        statusCode: 404,
        message: 'الطالب غير موجود'
      });
    }

    const userData = userSnapshot.docs[0].data();

    return {
      success: true,
      user: {
        uid,
        email,
        username: userData?.username || '',
        courses: userData?.courses || [],
        isAdmin: userData?.isAdmin || false,
      }
    };

  } catch (error) {
    console.error("Login error for:", email, error);

    let errorMessage = 'البريد الإلكتروني او كلمة المرور غير صحيحة';
    let statusCode = 401;

    // معالجة أخطاء Firebase Auth API
    const firebaseError = error?.data?.error?.message;

    switch (firebaseError) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'البريد الإلكتروني غير مسجل.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'كلمة المرور غير صحيحة.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'الحساب معطل من قبل الإدارة.';
        statusCode = 403;
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'عدد محاولات كثيرة. الرجاء المحاولة لاحقًا.';
        statusCode = 429;
        break;
      case 'INVALID_ID_TOKEN':
        errorMessage = 'انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.';
        statusCode = 401;
        break;
    }

    throw createError({ statusCode, message: errorMessage });
  }
});
