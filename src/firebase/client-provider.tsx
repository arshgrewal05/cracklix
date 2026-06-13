'use client';

import { ReactNode, useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

/**
 * @fileOverview Master Client Boundary Node.
 * SECURE: Initialized FirebaseErrorListener at the top-level client bridge.
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
