import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Core Firebase Initialization Node.
 * Safe for use in both Client Components and Server Actions.
 * UPDATED: Explicit exports to prevent Webpack resolution errors.
 */
export function initializeFirebase(): { app: FirebaseApp; firestore: Firestore; auth: Auth; storage: FirebaseStorage } {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

  return { app, firestore, auth, storage };
}

// Explicit member exports to avoid runtime "call" errors in Webpack 5
export { FirebaseProvider, useFirebaseApp, useFirestore, useAuth, useStorage } from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
