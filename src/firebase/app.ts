import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Hardened Firebase Initialization Singleton.
 * Prevents multiple app instance errors and ensures stable service resolution.
 */

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

export function initializeFirebase(): { app: FirebaseApp; firestore: Firestore; auth: Auth; storage: FirebaseStorage } {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    firestore = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    return { app, firestore, auth, storage };
  } catch (error) {
    console.error("[FIREBASE_INIT_CRITICAL]:", error);
    throw new Error("Cloud infrastructure failed to initialize.");
  }
}
