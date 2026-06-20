
'use client';

import { useEffect, useRef } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Hardened Single Active Session Enforcement v6.0.
 * LOGIC: Monitors Firestore profile. If another device logs in, this session is terminated.
 */
export default function SessionGuard() {
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const isSigningOut = useRef(false);

  useEffect(() => {
    // Phase 1: Wait for auth and profile hydration
    if (loading || !user || !profile || isSigningOut.current) return;

    const localSessionId = localStorage.getItem('cracklix_session_id');
    const authorizedDeviceId = profile.activeDeviceId;

    // Phase 2: Session Mismatch Audit
    // If an authorized session ID exists in Firestore and it doesn't match this device
    if (authorizedDeviceId && localSessionId && authorizedDeviceId !== localSessionId) {
      isSigningOut.current = true;
      
      // Phase 3: Immediate Force-Logout Node
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Your account was logged in from another device. For security, this session has been terminated.",
      });

      signOut(auth).then(() => {
        localStorage.removeItem('cracklix_session_id');
        // Reset state and clear registry references
        router.replace('/login');
        isSigningOut.current = false;
      }).catch(err => {
        console.error("[SESSION_GUARD_CRITICAL]:", err);
        isSigningOut.current = false;
      });
    }
  }, [user, profile, loading, auth, router, toast]);

  return null;
}
