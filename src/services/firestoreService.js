/**
 * Firestore Service — CRUD for user app state
 *
 * Data model (all under the user's own document tree):
 *
 *   users/{uid}                        ← profile (email, displayName, createdAt)
 *   users/{uid}/data/appState          ← full app state (habits, tasks, streaks, points…)
 *
 * Why a single appState document?
 *   • Minimises Firestore reads/writes → stays well within the free Spark tier.
 *   • One onSnapshot listener handles all real-time cross-device sync.
 *   • Total document size stays small (< 100 KB even after a year of use).
 *
 * Free-tier read/write budget per operation:
 *   • Initial load  : 1 read
 *   • Each save     : 1 write  (debounced to 1 s in HabitContext)
 *   • Real-time sync: 0 extra reads (Firebase charges only for changed docs)
 */

import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Reference to the user's single app-state document. */
const appStateRef = (uid) => doc(db, 'users', uid, 'data', 'appState');

/**
 * Trim dailyData to the last `days` entries.
 * Prevents the Firestore document from growing indefinitely.
 * At ~200 bytes/day the doc stays < 20 KB even after a full year.
 */
const trimDailyData = (dailyData = {}, days = 90) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0]; // 'YYYY-MM-DD'

  return Object.fromEntries(
    Object.entries(dailyData).filter(([date]) => date >= cutoffStr)
  );
};

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Save the full app state to Firestore.
 * Called from HabitContext whenever state changes (debounced by 1 s).
 *
 * We strip runtime-only fields (urgeTimer, showMotivation) before saving
 * because they have no meaning on a second device.
 */
export const saveAppState = async (uid, state) => {
  const ref = appStateRef(uid);

  const payload = {
    ...state,
    dailyData: trimDailyData(state.dailyData),
    // Reset transient UI state before persisting
    urgeTimer: null,
    showMotivation: false,
    updatedAt: serverTimestamp(),
  };

  await setDoc(ref, payload);
};

/**
 * Load the app state once (used as the initial fetch before subscribing).
 * Returns the stored state object, or null if this is a new user.
 */
export const loadAppState = async (uid) => {
  const snap = await getDoc(appStateRef(uid));
  return snap.exists() ? snap.data() : null;
};

/**
 * Subscribe to real-time updates of the app state.
 *
 * Uses { includeMetadataChanges: true } so we can distinguish:
 *   • hasPendingWrites === true  → our own optimistic write, skip to avoid echo loop
 *   • hasPendingWrites === false → confirmed server write (possibly from another device) → apply
 *
 * Returns the unsubscribe function — call it in useEffect cleanup.
 */
/**
 * onUpdate   — called with Firestore data when the document exists
 * onNotFound — called once when the document does NOT exist yet (brand-new user)
 * onError    — called on permission / network errors
 */
export const subscribeToAppState = (uid, onUpdate, onNotFound, onError) => {
  const ref = appStateRef(uid);

  return onSnapshot(
    ref,
    { includeMetadataChanges: true },
    (snap) => {
      // Skip our own pending writes to break the save → listen → save loop
      if (snap.metadata.hasPendingWrites) return;

      if (snap.exists()) {
        onUpdate(snap.data());
      } else {
        // Document doesn't exist yet (first-ever login for this user)
        if (onNotFound) onNotFound();
      }
    },
    onError
  );
};
