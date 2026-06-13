'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * @fileOverview Hardened Error Bridge.
 * Fixed: Updated to match the custom EventEmitter implementation for runtime stability.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Use setTimeout to ensure the throw happens outside the event emitter call stack
      // and triggers the Next.js Error Boundary correctly.
      setTimeout(() => {
        throw error;
      }, 0);
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, []);

  return null;
}
