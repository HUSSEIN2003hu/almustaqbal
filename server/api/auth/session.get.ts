import { adminAuth, adminDb } from "~/server/units/firebase-admin";

export default defineEventHandler(async (event) => {
    try {
      const sessionCookie = getCookie(event, '__session');
      
      if (!sessionCookie) return { valid: false };
  
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
      const userData = userDoc.data();
  
      return {
        valid: true,
        username: userData?.username,
        courses: userData?.courses || [],
        isAdmin: userData?.isAdmin || false,
        email: userData?.email

      };
      
    } catch (error) {
      deleteCookie(event, '__session');
      return { valid: false };
    }
  });