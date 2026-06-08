
'use client';

import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { UserProfile } from '@/types';

/**
 * @fileOverview Optimized Auth & Profile Hook.
 * PERFORMANCE: Separated Auth detection from Profile sync for immediate UI responsiveness.
 */
export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authCheckedRef = useRef(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      authCheckedRef.current = true;
      
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!user || !db) return;

    const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ ...docSnap.data(), id: docSnap.id } as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (err) => {
      console.error("[PROFILE SYNC ERROR]:", err);
      setLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user, db]);

  return { 
    user, 
    profile, 
    loading: !authCheckedRef.current || (user ? loading : false) 
  };
}
