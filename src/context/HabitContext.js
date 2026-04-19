/**
 * HabitContext — Global App State with Firebase Firestore Sync
 *
 * What changed from the original AsyncStorage version:
 *   1. State is loaded from Firestore (not AsyncStorage) when the user logs in.
 *   2. State is saved to Firestore on every change (debounced 1 s).
 *   3. An onSnapshot listener keeps state in sync across multiple devices in real time.
 *   4. The listener uses `hasPendingWrites` metadata to break the save→listen→save loop.
 *   5. userId is received as a prop — HabitProvider only mounts when the user is logged in.
 *
 * Free-tier read/write cost:
 *   • App start    : 1 read  (initial load via onSnapshot)
 *   • Every save   : 1 write (debounced, typically 1–5 per session)
 *   • Cross-device : 0 extra reads (Firestore pushes changes automatically)
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from 'react';
import { saveAppState, subscribeToAppState } from '../services/firestoreService';

// ─── Context ─────────────────────────────────────────────────────────────────

const HabitContext = createContext();

// ─── Default state ───────────────────────────────────────────────────────────

const initialState = {
  dailyData: {},
  habits: {
    smoking:         { name: 'Smoking',          target: 0, color: '#FF6B6B', streak: 0 },
    privateActivity: { name: 'Private Activity', target: 1, color: '#4ECDC4', streak: 0 },
    workout:         { name: 'Workout',           target: 1, color: '#45B7D1', streak: 0 },
    sleep:           { name: 'Sleep',             target: 8, color: '#96CEB4', streak: 0 },
  },
  tasks: [
    { id: '1', name: 'Walk 20 minutes',   completed: false, points: 10 },
    { id: '2', name: 'Avoid porn',        completed: false, points: 15 },
    { id: '3', name: 'Reduce 1 cigarette', completed: false, points: 20 },
    { id: '4', name: 'Eat breakfast',     completed: false, points: 5  },
  ],
  customTasks: [],
  taskCompletions: [],
  totalPoints: 0,
  badges: [],
  showMotivation: false,
  urgeTimer: null,
  notifications: { morning: true, evening: true, night: true },
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

function habitReducer(state, action) {
  switch (action.type) {

    case 'LOAD_STATE':
      // Merge with initialState so any new fields added in future updates are present
      return {
        ...initialState,
        ...action.payload,
        // Always guarantee these arrays exist even if Firestore doc is partial
        customTasks:     Array.isArray(action.payload?.customTasks)     ? action.payload.customTasks     : [],
        taskCompletions: Array.isArray(action.payload?.taskCompletions) ? action.payload.taskCompletions : [],
        tasks:           Array.isArray(action.payload?.tasks)           ? action.payload.tasks           : initialState.tasks,
        // Runtime-only — never loaded from storage
        urgeTimer:     null,
        showMotivation: false,
      };

    case 'LOG_HABIT': {
      const today = new Date().toISOString().split('T')[0];
      return {
        ...state,
        dailyData: {
          ...state.dailyData,
          [today]: {
            ...state.dailyData[today],
            [action.payload.habit]: action.payload.value,
          },
        },
      };
    }

    case 'UPDATE_STREAK':
      return {
        ...state,
        habits: {
          ...state.habits,
          [action.payload.habit]: {
            ...state.habits[action.payload.habit],
            streak: action.payload.streak,
          },
        },
      };

    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId ? { ...t, completed: true } : t
        ),
        totalPoints: state.totalPoints + action.payload.points,
      };

    case 'RESET_DAILY_TASKS':
      return {
        ...state,
        tasks: state.tasks.map((t) => ({ ...t, completed: false })),
      };

    case 'ADD_BADGE':
      return { ...state, badges: [...state.badges, action.payload] };

    case 'SET_URGE_TIMER':
      return { ...state, urgeTimer: action.payload };

    case 'TOGGLE_NOTIFICATION':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload]: !state.notifications[action.payload],
        },
      };

    case 'ADD_CUSTOM_TASK':
      return { ...state, customTasks: [...state.customTasks, action.payload] };

    case 'UPDATE_CUSTOM_TASK':
      return {
        ...state,
        customTasks: state.customTasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.updates } : t
        ),
      };

    case 'DELETE_CUSTOM_TASK':
      return {
        ...state,
        customTasks: state.customTasks.filter((t) => t.id !== action.payload),
      };

    case 'TOGGLE_CUSTOM_TASK_ACTIVE':
      return {
        ...state,
        customTasks: state.customTasks.map((t) =>
          t.id === action.payload ? { ...t, isActive: !t.isActive } : t
        ),
      };

    case 'COMPLETE_CUSTOM_TASK':
      return {
        ...state,
        taskCompletions: [...state.taskCompletions, action.payload],
        totalPoints: state.totalPoints + action.payload.points,
      };

    case 'LOAD_TASK_COMPLETIONS':
      return { ...state, taskCompletions: action.payload };

    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * HabitProvider must receive `userId` (the Firebase uid) as a prop.
 * It is only rendered when the user is authenticated (see app/_layout.tsx).
 */
export function HabitProvider({ children, userId }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  /**
   * isLoadingRef tracks whether the initial Firestore load has completed.
   * While true we skip writes so we don't echo data straight back to Firestore.
   */
  const isLoadingRef = useRef(true);

  /**
   * saveTimerRef holds the debounce timeout handle.
   * Cancelling on every state change means we only write once per "burst".
   */
  const saveTimerRef = useRef(null);

  // ── Firestore real-time subscription ───────────────────────────────────────

  useEffect(() => {
    if (!userId) return;

    isLoadingRef.current = true;

    const unsubscribe = subscribeToAppState(
      userId,
      // ── Existing user: load their saved state ──────────────────────────
      (remoteState) => {
        dispatch({ type: 'LOAD_STATE', payload: remoteState });
        isLoadingRef.current = false; // allow saves from now on
      },
      // ── New user: no Firestore document yet ────────────────────────────
      // Keep initialState, unlock saves so the first change writes the doc
      () => {
        isLoadingRef.current = false;
      },
      // ── Error (permission denied, network, etc.) ───────────────────────
      (err) => {
        console.error('[HabitContext] Firestore subscription error:', err);
        isLoadingRef.current = false; // still allow saves to retry
      }
    );

    return () => {
      unsubscribe();
      isLoadingRef.current = true; // Reset for next mount
    };
  }, [userId]);

  // ── Debounced Firestore save ────────────────────────────────────────────────

  useEffect(() => {
    // Don't write while loading the initial snapshot, or if there's no user
    if (isLoadingRef.current || !userId) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(async () => {
      try {
        await saveAppState(userId, state);
      } catch (err) {
        console.error('[HabitContext] Failed to save to Firestore:', err);
      }
    }, 1000); // 1-second debounce — batches rapid consecutive changes

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state, userId]);

  // ── Action creators ────────────────────────────────────────────────────────

  const logHabit = (habit, value) =>
    dispatch({ type: 'LOG_HABIT', payload: { habit, value } });

  const updateStreak = (habit, streak) =>
    dispatch({ type: 'UPDATE_STREAK', payload: { habit, streak } });

  const completeTask = (taskId, points) =>
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId, points } });

  const resetDailyTasks = () =>
    dispatch({ type: 'RESET_DAILY_TASKS' });

  const addBadge = (badge) =>
    dispatch({ type: 'ADD_BADGE', payload: badge });

  const setUrgeTimer = (timer) =>
    dispatch({ type: 'SET_URGE_TIMER', payload: timer });

  const toggleNotification = (type) =>
    dispatch({ type: 'TOGGLE_NOTIFICATION', payload: type });

  const addCustomTask = (task) =>
    dispatch({ type: 'ADD_CUSTOM_TASK', payload: task });

  const updateCustomTask = (taskId, updates) =>
    dispatch({ type: 'UPDATE_CUSTOM_TASK', payload: { id: taskId, updates } });

  const deleteCustomTask = (taskId) =>
    dispatch({ type: 'DELETE_CUSTOM_TASK', payload: taskId });

  const toggleCustomTaskActive = (taskId) =>
    dispatch({ type: 'TOGGLE_CUSTOM_TASK_ACTIVE', payload: taskId });

  const completeCustomTask = (completion) =>
    dispatch({ type: 'COMPLETE_CUSTOM_TASK', payload: completion });

  const loadTaskCompletions = (completions) =>
    dispatch({ type: 'LOAD_TASK_COMPLETIONS', payload: completions });

  // ── Context value ──────────────────────────────────────────────────────────

  return (
    <HabitContext.Provider
      value={{
        state,
        logHabit,
        updateStreak,
        completeTask,
        resetDailyTasks,
        addBadge,
        setUrgeTimer,
        toggleNotification,
        addCustomTask,
        updateCustomTask,
        deleteCustomTask,
        toggleCustomTaskActive,
        completeCustomTask,
        loadTaskCompletions,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHabit() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabit must be used within HabitProvider');
  return ctx;
}
