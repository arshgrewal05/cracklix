'use client';

import { ReactNode, useMemo } from 'react';
import { initializeFirebase } from './app';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

/**
 * @fileOverview Master Client Boundary Node.
 * SECURE: Imports initialization singleton from the isolated app node.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, firestore, auth, storage } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth} storage={storage}>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
