'use client';

import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { UserProfile } from '@/types';

/**
 * @fileOverview Hardened Auth & Profile Hook v4.0.
 * DEFENSIVE: Ensures loading is true until both Auth AND Firestore profile are synchronized.
 * STABILITY: Prevents blank screens during initial boot.
 */
export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
  
  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthResolved(true);
      
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    }, (err) => {
      console.error("[AUTH_SYNC_FAILURE]:", err);
      setLoading(false);
      setAuthResolved(true);
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!user || !db) return;

    setLoading(true);

    const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({ ...data, id: docSnap.id } as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("[PROFILE_HUB_FAILURE]:", err);
      setLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user, db]);

  // Comprehensive safety check for consuming components
  const isSyncing = !authResolved || (user && !profile && loading);

  return { 
    user, 
    profile, 
    loading: isSyncing 
  };
}
