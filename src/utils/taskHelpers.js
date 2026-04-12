import { getDateRange } from './helpers';

/**
 * Generate a simple UUID v4 (fallback implementation)
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Create a new custom task
 */
export const createCustomTask = (name, repeatType, reminderEnabled = false, reminderTime = '09:00', pointsReward = 10, description = '') => {
  return {
    id: generateUUID(),
    name,
    description,
    repeatType, // 'daily' or 'weekly'
    reminderEnabled,
    reminderTime,
    pointsReward,
    createdAt: new Date().toISOString(),
    completedDates: [],
    isActive: true,
  };
};

/**
 * Check if a task should appear today
 */
export const shouldTaskAppearToday = (task) => {
  if (!task.isActive) return false;
  
  if (task.repeatType === 'daily') {
    return true;
  }
  
  if (task.repeatType === 'weekly') {
    // Check if today is the creation day of the week
    const createdDate = new Date(task.createdAt);
    const createdDayOfWeek = createdDate.getDay();
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    
    return createdDayOfWeek === todayDayOfWeek;
  }
  
  return false;
};

/**
 * Check if task is completed today
 */
export const isTaskCompletedToday = (task, completionLogs) => {
  const today = new Date().toISOString().split('T')[0];
  return completionLogs.some(
    (log) => log.taskId === task.id && log.dateCompleted === today
  );
};

/**
 * Mark task as completed for today
 */
export const completeTaskToday = (taskId, completionLogs) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already completed today
  if (completionLogs.some((log) => log.taskId === taskId && log.dateCompleted === today)) {
    return completionLogs;
  }
  
  return [
    ...completionLogs,
    {
      taskId,
      dateCompleted: today,
      completedAt: new Date().toISOString(),
      dayOfWeek: new Date().getDay(),
    },
  ];
};

/**
 * Get completion percentage for a task (last 7 days)
 */
export const getTaskCompletionPercentage = (taskId, completionLogs, days = 7) => {
  const dateRange = getDateRange(days);
  const completionsInRange = completionLogs.filter(
    (log) => log.taskId === taskId && dateRange.includes(log.dateCompleted)
  );
  
  return Math.round((completionsInRange.length / days) * 100);
};

/**
 * Get current streak for a task
 */
export const getCurrentTaskStreak = (taskId, completionLogs) => {
  const dateRange = getDateRange(30); // Check last 30 days
  let streak = 0;
  
  for (let i = 0; i < dateRange.length; i++) {
    const date = dateRange[i];
    const hasCompletion = completionLogs.some(
      (log) => log.taskId === taskId && log.dateCompleted === date
    );
    
    if (hasCompletion) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Get best streak for a task (all time)
 */
export const getBestTaskStreak = (taskId, completionLogs) => {
  if (completionLogs.length === 0) return 0;
  
  const sortedLogs = completionLogs
    .filter((log) => log.taskId === taskId)
    .sort((a, b) => new Date(a.dateCompleted) - new Date(b.dateCompleted));
  
  let bestStreak = 0;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedLogs.length; i++) {
    const currentDate = new Date(sortedLogs[i].dateCompleted);
    const previousDate = new Date(sortedLogs[i - 1].dateCompleted);
    
    const dayDifference = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));
    
    if (dayDifference === 1) {
      currentStreak++;
    } else {
      bestStreak = Math.max(bestStreak, currentStreak);
      currentStreak = 1;
    }
  }
  
  bestStreak = Math.max(bestStreak, currentStreak);
  return bestStreak;
};

/**
 * Generate task insight
 */
export const generateTaskInsight = (taskName, completionPercentage, currentStreak) => {
  if (completionPercentage === 100) {
    return `Perfect! Completing ${taskName} 100% of the time 🔥`;
  }
  
  if (completionPercentage >= 75) {
    return `Great job! ${taskName} at ${completionPercentage}% - Keep the momentum!`;
  }
  
  if (completionPercentage >= 50) {
    return `Good progress on ${taskName} (${completionPercentage}%) - You can do better!`;
  }
  
  if (completionPercentage > 0) {
    return `${taskName} is at ${completionPercentage}% - Time to focus on this!`;
  }
  
  return `Get started with ${taskName} - Track your first completion!`;
};

/**
 * Calculate overall task metrics
 */
export const calculateOverallTaskMetrics = (customTasks, completionLogs) => {
  const activeTasksWithAppearance = customTasks.filter((task) => shouldTaskAppearToday(task));
  
  if (activeTasksWithAppearance.length === 0) {
    return {
      totalTasks: 0,
      overallCompletion: 0,
      mostConsistentTask: null,
      leastPerformingTask: null,
      tasksAtRisk: [],
    };
  }
  
  const taskMetrics = activeTasksWithAppearance.map((task) => ({
    id: task.id,
    name: task.name,
    percentage: getTaskCompletionPercentage(task.id, completionLogs),
  }));
  
  const overallCompletion = Math.round(
    taskMetrics.reduce((sum, task) => sum + task.percentage, 0) / taskMetrics.length
  );
  
  const mostConsistentTask = taskMetrics.reduce((max, task) =>
    task.percentage > max.percentage ? task : max
  );
  
  const leastPerformingTask = taskMetrics.reduce((min, task) =>
    task.percentage < min.percentage ? task : min
  );
  
  const tasksAtRisk = taskMetrics.filter(
    (task) => task.percentage > 0 && task.percentage < 50
  );
  
  return {
    totalTasks: activeTasksWithAppearance.length,
    overallCompletion,
    mostConsistentTask,
    leastPerformingTask,
    tasksAtRisk,
  };
};

/**
 * Validate custom task properties
 */
export const validateCustomTask = (name, repeatType) => {
  const errors = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('Task name is required');
  }
  
  if (name && name.length > 50) {
    errors.push('Task name must be 50 characters or less');
  }
  
  if (!['daily', 'weekly'].includes(repeatType)) {
    errors.push('RepeatType must be daily or weekly');
  }
  
  return errors;
};

/**
 * Clear daily completions (reset at midnight)
 */
export const resetDailyTasksCompletion = (completionLogs, customTasks) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Remove today's completions to reset
  return completionLogs.filter((log) => log.dateCompleted !== today);
};

/**
 * Get tasks completed today
 */
export const getTasksCompletedToday = (customTasks = [], completionLogs = []) => {
  // Handle undefined or non-array inputs
  if (!Array.isArray(customTasks)) return [];
  if (!Array.isArray(completionLogs)) completionLogs = [];
  
  const activeTasks = customTasks.filter((task) => shouldTaskAppearToday(task));
  
  return activeTasks.map((task) => ({
    ...task,
    isCompletedToday: isTaskCompletedToday(task, completionLogs),
  }));
};

/**
 * Get daily task progress (X/Y completed)
 */
export const getDailyTaskProgress = (customTasks = [], completionLogs = []) => {
  // Handle undefined or non-array inputs
  if (!Array.isArray(customTasks)) customTasks = [];
  if (!Array.isArray(completionLogs)) completionLogs = [];
  
  const tasksToday = getTasksCompletedToday(customTasks, completionLogs);
  const completedCount = tasksToday.filter((task) => task.isCompletedToday).length;
  
  return {
    completed: completedCount,
    total: tasksToday.length,
    percentage: tasksToday.length > 0 ? Math.round((completedCount / tasksToday.length) * 100) : 0,
  };
};
