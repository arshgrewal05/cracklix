'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * @fileOverview A component that listens for FirestorePermissionError events 
 * and throws them as uncaught exceptions to trigger the Next.js error overlay.
 * UPDATED: Hardened to handle non-Error objects and prevent [object Event] crashes 
 * by using a check and deferred throw.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: unknown) => {
      // 1. Audit Error Identity
      if (error instanceof Error) {
        // Use setTimeout to ensure the throw happens outside the event emitter call stack
        // This prevents the [object Event] wrapping in some environments.
        setTimeout(() => {
          throw error;
        }, 0);
      } else {
        // 2. Fallback for non-standard events (e.g. from generic try/catch leaks)
        console.error("[CBT SECURITY EVENT]:", error);
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
