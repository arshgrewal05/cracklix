import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

/**
 * @fileOverview Environment-Agnostic Firebase Initialization Singleton.
 * Separated from hooks to prevent circular dependencies in Server/Client boundary nodes.
 */

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

export function initializeFirebase(): { app: FirebaseApp; firestore: Firestore; auth: Auth; storage: FirebaseStorage } {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  firestore = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  return { app, firestore, auth, storage };
}
