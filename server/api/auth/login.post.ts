// ~/server/api/login.post.ts
import { adminAuth, adminDb } from "~/server/units/firebase-admin";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  // 1. التحقق من البيانات المدخلة
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: "البريد الإلكتروني وكلمة المرور مطلوبان."
    });
  }

  try {
    // 2. المصادقة باستخدام Firebase REST API
    const FIREBASE_API_KEY = useRuntimeConfig().apiKey;
    const { idToken, localId: uid } = await $fetch(
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
    

    await adminAuth.revokeRefreshTokens(uid);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 604800000 // 7 أيام
    });

    // 4. تخزين الكوكي الآمن
    setCookie(event, '__session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800 // 7 أيام بالثواني
    });

    // 5. جلب بيانات المستخدم الإضافية
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw createError({ statusCode: 404, message: 'المستخدم غير موجود' });
    }

    const userData = userDoc.data();
    
    return {
      success: true,
      user: {
        uid,
        email,
        username: userData?.username,
        courses: userData?.courses || [],
        isAdmin: userData?.isAdmin || false,

      }
    };

  } catch (error) {
    console.log(error);
    // 6. معالجة الأخطاء الدقيقة
    let errorMessage = error;
    let statusCode = 401;

    if (error.data?.error?.message) {
      const firebaseError = error.data.error.message;
      
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
      }
    }

    throw createError({ statusCode, message: 'البريد الإلكتروني او كلمة المرور غير صحيحة' });
  }
});