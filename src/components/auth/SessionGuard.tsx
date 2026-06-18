'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useUser } from '@/firebase';
import { getDeviceId } from '@/lib/device';
import { usePathname } from 'next/navigation';

/**
 * @fileOverview Hardened Production Session Guard v4.0.
 * Enforces "One Account = One Active Device" using a "Last Login Wins" protocol.
 * FIXED: Path exclusion for /login and stabilized ID comparison.
 */
export default function SessionGuard() {
  const auth = useAuth();
  const db = useFirestore();
  const { user, profile } = useUser();
  const pathname = usePathname();
  const [localDeviceId, setLocalDeviceId] = useState<string | null>(null);

  useEffect(() => {
    getDeviceId().then(setLocalDeviceId);
  }, []);

  useEffect(() => {
    // 1. Safety Guards: Don't run on login page or if not logged in
    if (!user || !db || !auth || !localDeviceId || pathname === '/login') return;

    // 2. Admin Bypass: Allow multi-device sessions for auditing
    if (profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') return;

    let unsubscribe: (() => void) | undefined;

    const startEnforcement = () => {
      unsubscribe = onSnapshot(
        doc(db, 'users', user.uid),
        async (snap) => {
          if (!snap.exists()) return;

          const data = snap.data();

          // 3. Last-Login Enforcement
          // If the registry's active device doesn't match this local node, terminate session
          if (
            data.activeDeviceId &&
            data.activeDeviceId !== localDeviceId
          ) {
            console.warn("[SDL_ENFORCEMENT]: Session taken over by another device.");
            
            // Immediate sign out
            await signOut(auth);

            // Redirect with audit flag for UI feedback
            window.location.href = '/login?session=terminated';
          }
        },
        (error) => {
          console.error("[SDL_LISTENER_ERROR]:", error);
        }
      );
    };

    startEnforcement();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, profile, auth, db, localDeviceId, pathname]);

  return null;
}
