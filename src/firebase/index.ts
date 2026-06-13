'use client';

/**
 * @fileOverview Pure Client-Side Registry Barrel.
 * ONLY exports hooks and providers intended for the client runtime.
 */

export { FirebaseProvider, useFirebaseApp, useFirestore, useAuth, useStorage } from './provider';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useUser } from './auth/use-user';
