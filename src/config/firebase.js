/**
 * Firebase Configuration — habit-tracker-4e9f7
 * Compatible with Expo Go SDK 54 + firebase@10
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAgeYxYvzCftalkNKqPUmr9mj-IXes28CM',
  authDomain: 'habit-tracker-4e9f7.firebaseapp.com',
  projectId: 'habit-tracker-4e9f7',
  storageBucket: 'habit-tracker-4e9f7.firebasestorage.app',
  messagingSenderId: '117186594139',
  appId: '1:117186594139:web:707cfcf67af785a332c67e',
};

// Prevent "app already exists" error on hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Simple auth — no custom persistence setup (avoids Expo Go native module issues)
// User session persists via Firebase's default in-memory + AsyncStorage via SDK internals
const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
export default app;
