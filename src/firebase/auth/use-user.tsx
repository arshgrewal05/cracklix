'use client';

import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import { UserProfile } from '@/types';
import { getDeviceId } from '@/lib/device';

/**
 * @fileOverview Hardened Auth & Profile Hub v6.1.
 * Persistent: Uses onAuthStateChanged to maintain stable login states.
 * Real-time Expiry: Audits pass expiry dates on every snapshot.
 */
export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>("");
  
  const profileLoaded = useRef(false);

  useEffect(() => {
    getDeviceId().then(setCurrentDeviceId);
  }, []);

  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthResolved(true);
      
      if (firebaseUser) {
        setProfileLoading(!profileLoaded.current);
      } else {
        setProfile(null);
        setProfileLoading(false);
        profileLoaded.current = true;
      }
    }, (err) => {
      console.error("[AUTH_SYNC_FAILURE]:", err);
      setAuthResolved(true);
      setProfileLoading(false);
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (!user || !db) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(!profileLoaded.current);

    const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // --- REAL-TIME EXPIRY AUDIT ---
        let passStatus = data.passStatus || 'none';
        let passActive = false;

        // 1. Audit by Expiry Date
        if (data.passExpiresAt) {
           const expiryDate = new Date(data.passExpiresAt);
           const now = new Date();
           
           if (now > expiryDate) {
              passStatus = 'expired';
              passActive = false;
           } else if (data.pass?.active !== false) {
              passStatus = 'active';
              passActive = true;
           }
        } 
        // 2. Audit by legacy boolean if date missing
        else if (data.pass?.active === true) {
           passStatus = 'active';
           passActive = true;
        }

        setProfile({ 
          ...data, 
          id: docSnap.id, 
          passStatus,
          pass: {
            ...(data.pass || {}),
            active: passActive
          }
        } as UserProfile);
      } else {
        setProfile(null);
      }
      
      profileLoaded.current = true;
      setProfileLoading(false);
    }, (err) => {
      profileLoaded.current = true;
      setProfileLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user, db]);

  return { 
    user, 
    profile, 
    loading: !authResolved, 
    profileLoading,         
    currentDeviceId
  };
}
