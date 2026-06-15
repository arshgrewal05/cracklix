
'use client';

import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { UserProfile } from '@/types';
import { getDeviceId } from '@/lib/device';

/**
 * @fileOverview Hardened Auth & Profile Hook v5.0 (Device Aware).
 */
export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authResolved, setAuthResolved] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");
  
  useEffect(() => {
    getDeviceId().then(setCurrentDeviceId);
  }, []);

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

  const isDeviceAuthorized = useMemo(() => {
    if (!profile) return true;
    if (!profile.deviceLock?.deviceId) return true;
    if (profile.role === 'ADMIN' || profile.role === 'SUPER_ADMIN') return true;
    
    // Enforcement Levels: 0: Off, 1: Track, 2: Warning (Return true but UI might show toast), 3: Block
    if (profile.deviceLock.enforcementLevel < 3) return true;

    return profile.deviceLock.deviceId === currentDeviceId;
  }, [profile, currentDeviceId]);

  // Comprehensive safety check for consuming components
  const isSyncing = !authResolved || (user && !profile && loading);

  return { 
    user, 
    profile, 
    loading: isSyncing,
    currentDeviceId,
    isDeviceAuthorized
  };
}
