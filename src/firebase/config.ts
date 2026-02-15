import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
}

export function getApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
  }
  return app;
}

export function getDb(): Firestore | null {
  const firebaseApp = getApp();
  if (!firebaseApp) return null;
  if (!db) {
    db = getFirestore(firebaseApp);
  }
  return db;
}
