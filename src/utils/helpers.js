import { format, parseISO } from 'date-fns';

export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDateRange = (days) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export const calculateStreak = (dailyData, habit, targetValue) => {
  const today = getToday();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = dailyData[dateStr];

    if (!dayData || dayData[habit] !== targetValue) {
      break;
    }

    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

export const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (_error) {
    return dateString;
  }
};

export const formatDateShort = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM d');
  } catch (_error) {
    return dateString;
  }
};

export const getWeekData = (dailyData, habit) => {
  const dates = getDateRange(7);
  return dates.map((date) => ({
    date: formatDateShort(date),
    value: dailyData[date]?.[habit] || 0,
  }));
};

export const getMonthData = (dailyData, habit) => {
  const dates = getDateRange(30);
  return dates.map((date) => ({
    date: formatDateShort(date),
    value: dailyData[date]?.[habit] || 0,
  }));
};

export const calculateReduction = (dailyData, habit, initialValue) => {
  const monthData = getMonthData(dailyData, habit);
  const firstWeekAvg =
    monthData.slice(0, 7).reduce((sum, item) => sum + item.value, 0) / 7;
  const lastWeekAvg =
    monthData.slice(-7).reduce((sum, item) => sum + item.value, 0) / 7;

  const reduction = ((firstWeekAvg - lastWeekAvg) / firstWeekAvg) * 100;
  return Math.round(reduction) || 0;
};

export const getRandomMotivation = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const getTimePeriod = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const isDayCompleted = (dailyData, habit, targetValue) => {
  const today = getToday();
  return dailyData[today]?.[habit] === targetValue;
};

export const calculateTotalReduction = (dailyData, habits) => {
  let totalReduction = 0;
  let count = 0;

  if (habits) {
    Object.keys(habits).forEach((habit) => {
      if (habit !== 'sleep') {
        const reduction = calculateReduction(
          dailyData,
          habit,
          habits[habit].target
        );
        totalReduction += reduction;
        count++;
      }
    });
  }

  return Math.round(totalReduction / count) || 0;
};

export const getStreakColor = (streak) => {
  if (streak === 0) return '#F56565';
  if (streak < 7) return '#ED8936';
  if (streak < 30) return '#48BB78';
  return '#667EEA';
};

export const getAchievementBadge = (streak) => {
  if (streak >= 100) return '👑';
  if (streak >= 30) return '🏆';
  if (streak >= 14) return '⭐';
  if (streak >= 7) return '🥈';
  if (streak >= 3) return '🥉';
  return null;
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getDayName = (dateString) => {
  try {
    return format(parseISO(dateString), 'EEEE');
  } catch (_error) {
    return dateString;
  }
};

export const getWeekProgress = (dailyData, habits) => {
  const dates = getDateRange(7);
  let completedDays = 0;

  if (habits) {
    dates.forEach((date) => {
      const dayData = dailyData[date];
      if (dayData) {
        let completed = true;
        Object.keys(habits).forEach((habit) => {
          if (dayData[habit] !== habits[habit].target) {
            completed = false;
          }
        });
        if (completed) completedDays++;
      }
    });
  }

  return {
    completed: completedDays,
    total: 7,
    percentage: Math.round((completedDays / 7) * 100),
  };
};
