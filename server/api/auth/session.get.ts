import { adminAuth, adminDb } from "~/server/units/firebase-admin";

export default defineEventHandler(async (event) => {
    try {
      const sessionCookie = getCookie(event, '__session');
      
      if (!sessionCookie) return { valid: false };
  
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      const userDoc = await adminDb.collection('users').where ('uid', '==', decodedToken.uid).limit(1).get();
      const userData = userDoc.docs[0]?.data();
  
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