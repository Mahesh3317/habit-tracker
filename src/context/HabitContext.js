import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const HabitContext = createContext();

const initialState = {
  dailyData: {},
  habits: {
    smoking: { name: 'Smoking', target: 0, color: '#FF6B6B', streak: 0 },
    privateActivity: { name: 'Private Activity', target: 1, color: '#4ECDC4', streak: 0 },
    workout: { name: 'Workout', target: 1, color: '#45B7D1', streak: 0 },
    sleep: { name: 'Sleep', target: 8, color: '#96CEB4', streak: 0 },
  },
  tasks: [
    { id: '1', name: 'Walk 20 minutes', completed: false, points: 10 },
    { id: '2', name: 'Avoid porn', completed: false, points: 15 },
    { id: '3', name: 'Reduce 1 cigarette', completed: false, points: 20 },
    { id: '4', name: 'Eat breakfast', completed: false, points: 5 },
  ],
  customTasks: [], // NEW: User-created custom tasks
  taskCompletions: [], // NEW: Track custom task completions
  totalPoints: 0,
  badges: [],
  showMotivation: false,
  urgeTimer: null,
  notifications: {
    morning: true,
    evening: true,
    night: true,
  },
};

function habitReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      try {
        return { ...action.payload };
      } catch (error) {
        console.warn('Failed to load state, using initial state:', error);
        return state;
      }
    
    case 'LOG_HABIT':
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
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, completed: true }
            : task
        ),
        totalPoints: state.totalPoints + action.payload.points,
      };

    case 'RESET_DAILY_TASKS':
      return {
        ...state,
        tasks: state.tasks.map((task) => ({ ...task, completed: false })),
      };

    case 'ADD_BADGE':
      return {
        ...state,
        badges: [...state.badges, action.payload],
      };

    case 'SET_URGE_TIMER':
      return {
        ...state,
        urgeTimer: action.payload,
      };

    case 'TOGGLE_NOTIFICATION':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload]: !state.notifications[action.payload],
        },
      };

    case 'ADD_CUSTOM_TASK':
      return {
        ...state,
        customTasks: [...state.customTasks, action.payload],
      };

    case 'UPDATE_CUSTOM_TASK':
      return {
        ...state,
        customTasks: state.customTasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };

    case 'DELETE_CUSTOM_TASK':
      return {
        ...state,
        customTasks: state.customTasks.filter((task) => task.id !== action.payload),
      };

    case 'TOGGLE_CUSTOM_TASK_ACTIVE':
      return {
        ...state,
        customTasks: state.customTasks.map((task) =>
          task.id === action.payload
            ? { ...task, isActive: !task.isActive }
            : task
        ),
      };

    case 'COMPLETE_CUSTOM_TASK':
      return {
        ...state,
        taskCompletions: [...state.taskCompletions, action.payload],
        totalPoints: state.totalPoints + action.payload.points,
      };

    case 'LOAD_TASK_COMPLETIONS':
      return {
        ...state,
        taskCompletions: action.payload,
      };

    case 'LOAD_STATE':
      // Merge loaded state with initialState to ensure all properties exist
      return {
        ...initialState,
        ...action.payload,
        customTasks: (action.payload && action.payload.customTasks) || [],
        taskCompletions: (action.payload && action.payload.taskCompletions) || [],
      };

    default:
      return state;
  }
}

export function HabitProvider({ children }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Save state and custom data to AsyncStorage
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem('habitState', JSON.stringify(state));
        await AsyncStorage.setItem('@habittrackerapp/customTasks', JSON.stringify(state.customTasks));
        await AsyncStorage.setItem('@habittrackerapp/taskCompletions', JSON.stringify(state.taskCompletions));
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    };

    const timer = setTimeout(saveState, 1000);
    return () => clearTimeout(timer);
  }, [state]);

  // Load state from AsyncStorage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('habitState');
        if (savedState) {
          dispatch({
            type: 'LOAD_STATE',
            payload: JSON.parse(savedState),
          });
        }
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    };

    loadState();
  }, []);

  const logHabit = (habit, value) => {
    dispatch({ type: 'LOG_HABIT', payload: { habit, value } });
  };

  const updateStreak = (habit, streak) => {
    dispatch({ type: 'UPDATE_STREAK', payload: { habit, streak } });
  };

  const completeTask = (taskId, points) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { taskId, points } });
  };

  const resetDailyTasks = () => {
    dispatch({ type: 'RESET_DAILY_TASKS' });
  };

  const addBadge = (badge) => {
    dispatch({ type: 'ADD_BADGE', payload: badge });
  };

  const setUrgeTimer = (timer) => {
    dispatch({ type: 'SET_URGE_TIMER', payload: timer });
  };

  const toggleNotification = (type) => {
    dispatch({ type: 'TOGGLE_NOTIFICATION', payload: type });
  };

  const addCustomTask = (task) => {
    dispatch({ type: 'ADD_CUSTOM_TASK', payload: task });
  };

  const updateCustomTask = (taskId, updates) => {
    dispatch({ type: 'UPDATE_CUSTOM_TASK', payload: { id: taskId, updates } });
  };

  const deleteCustomTask = (taskId) => {
    dispatch({ type: 'DELETE_CUSTOM_TASK', payload: taskId });
  };

  const toggleCustomTaskActive = (taskId) => {
    dispatch({ type: 'TOGGLE_CUSTOM_TASK_ACTIVE', payload: taskId });
  };

  const completeCustomTask = (completion) => {
    dispatch({ type: 'COMPLETE_CUSTOM_TASK', payload: completion });
  };

  const loadTaskCompletions = (completions) => {
    dispatch({ type: 'LOAD_TASK_COMPLETIONS', payload: completions });
  };

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

export function useHabit() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within HabitProvider');
  }
  return context;
}
