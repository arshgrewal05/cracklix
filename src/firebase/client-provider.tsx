'use client';

import { ReactNode, useMemo, useState, useEffect } from 'react';
import { initializeFirebase } from './app';
import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import SessionGuard from '@/components/auth/SessionGuard';

/**
 * @fileOverview Master Client Boundary Node v2.4 (Chunk Hardened).
 * SECURE: Integrates the real-time Session Guard for one-device policy.
 * STABILITY: Improved hydration guard to resolve ChunkLoadError in layout.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { app, firestore, auth, storage } = useMemo(() => initializeFirebase(), []);

  // Hydration Guard: Prevents ChunkLoadError by ensuring no hydration mismatch occurs
  // during the asynchronous Firebase initialization phase.
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
         <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth} storage={storage}>
      <FirebaseErrorListener />
      <SessionGuard />
      {children}
    </FirebaseProvider>
  );
}
