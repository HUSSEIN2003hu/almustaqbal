import admin, { initializeApp } from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const config = useRuntimeConfig();

// Prüfe, ob Firebase Admin bereits initialisiert wurde
if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(config.firebaseAdmin)),
  });
  
}
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
