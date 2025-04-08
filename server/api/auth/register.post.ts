import { adminAuth, adminDb } from "~/server/units/firebase-admin";
import courses from "../admin/courses";

export default defineEventHandler(async (event) => {
    const { code, email, password } = await readBody(event);

    if (!code || !email || !password) {
      throw createError({ statusCode: 409, message: "الرجاء إدخال جميع البيانات المطلوبة: البريد الإلكتروني، كلمة المرور، ورمز التفعيل." });
    }

    // 1. Code validieren
    const codeRef = adminDb.collection('activationCodes').doc(code);
    const codeSnap = await codeRef.get();

    if (!codeSnap.exists) {
      throw createError({ statusCode: 409, message: "رمز التفعيل غير موجود. تأكد من إدخال الرمز الصحيح." });
  }

  if (codeSnap.data()?.used) {
      throw createError({ statusCode: 409, message: "تم استخدام رمز التفعيل هذا مسبقًا. يرجى طلب رمز جديد." });
  }

    try {
        // 2. Benutzer mit Admin SDK erstellen
        const user = await adminAuth.createUser({
            email,
            password,
        });

        // 3. Firestore-Transaktion
        const batch = adminDb.batch();

        // Markiere Code als verwendet
        batch.update(codeRef, {
            email,
            used: true,
            usedBy: user.uid,
            courses: codeSnap.data()?.courses || [],
            usedAt: Date.now(),
        });

        // Erstelle User-Dokument
        batch.set(adminDb.collection('users').doc(user.uid), {
            email,
            username: codeSnap.data()?.username,
            createdAt: Date.now(),
            code: code,
            courses: codeSnap.data()?.courses || [],
        });

        await batch.commit();

        return { success: true, username: codeSnap.data()?.username };
    } catch (error) {
        console.error(error?.message);
        throw createError({ statusCode: 500, message: error?.message || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى." });
    }
});
