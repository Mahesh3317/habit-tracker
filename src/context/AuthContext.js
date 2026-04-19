/**
 * AuthContext — Firebase Authentication State
 *
 * Provides:
 *   user     — the current Firebase user (or null if logged out)
 *   loading  — true while Firebase checks stored credentials on startup
 *   signUp   — create account with email + password
 *   logIn    — sign in with email + password
 *   logOut   — sign out
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // loading = true until Firebase resolves persisted session (prevents flash of login screen)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged fires once on mount with the persisted user (or null),
    // then again whenever the user logs in or out.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe; // remove listener when provider unmounts
  }, []);

  /**
   * Create a new account.
   * Also writes a user profile document to Firestore so we have metadata.
   */
  const signUp = async (email, password, displayName) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = credential.user;

    // Set displayName on the Firebase Auth profile
    await updateProfile(newUser, { displayName: displayName.trim() });

    // Create profile doc in Firestore — used to verify the account exists
    await setDoc(doc(db, 'users', newUser.uid), {
      email: email.toLowerCase().trim(),
      displayName: displayName.trim(),
      createdAt: serverTimestamp(),
    });

    return newUser;
  };

  /** Sign in with email and password. */
  const logIn = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  /** Sign out the current user. */
  const logOut = async () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Access auth state and actions anywhere inside AuthProvider. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
