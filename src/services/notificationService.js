import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { MOTIVATIONAL_QUOTES, URGE_ALTERNATIVES } from '../constants';
import { getRandomMotivation } from '../utils/helpers';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const initializeNotifications = async () => {
  try {
    // Skip notification setup for now - just log if it fails
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync().catch(ignoreErr => {
          console.warn('Could not request notification permissions:', ignoreErr?.message);
        });
      }
    } catch (permError) {
      console.warn('Notification permission check failed:', permError?.message);
    }
    return true;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return null;
  }
};

export const sendMorningNotification = async () => {
  try {
    const motivation = getRandomMotivation(MOTIVATIONAL_QUOTES.discipline);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌅 Good Morning!',
        body: motivation,
        data: { type: 'morning' },
        sound: true,
      },
      trigger: {
        hour: 6,
        minute: 0,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error sending morning notification:', error);
  }
};

export const sendEveningNotification = async () => {
  try {
    const alternatives = URGE_ALTERNATIVES.slice(0, 3)
      .map((a) => a.name)
      .join(', ');

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Evening Reminder',
        body: `Stay strong! Try these instead: ${alternatives}`,
        data: { type: 'evening' },
        sound: true,
      },
      trigger: {
        hour: 18,
        minute: 0,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error sending evening notification:', error);
  }
};

export const sendNightNotification = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌙 Time to Sleep',
        body: 'Get 7-9 hours of quality sleep for better self-control tomorrow.',
        data: { type: 'night' },
        sound: true,
      },
      trigger: {
        hour: 22,
        minute: 0,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error sending night notification:', error);
  }
};

export const sendUrgeNotification = async () => {
  try {
    const alternative = getRandomMotivation(URGE_ALTERNATIVES);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '💪 You Got This!',
        body: `Try ${alternative.name} (${alternative.duration}) instead`,
        data: { type: 'urge' },
        sound: true,
      },
      trigger: 1,
    });
  } catch (error) {
    console.error('Error sending urge notification:', error);
  }
};

export const sendStreakNotification = async (habit, streak) => {
  try {
    let badge = '🥉';
    if (streak >= 100) badge = '👑';
    else if (streak >= 30) badge = '🏆';
    else if (streak >= 14) badge = '⭐';
    else if (streak >= 7) badge = '🥈';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${badge} Streak Milestone!`,
        body: `You've achieved a ${streak}-day streak! Keep it going!`,
        data: { type: 'streak', habit, streak },
        sound: true,
      },
      trigger: 1,
    });
  } catch (error) {
    console.error('Error sending streak notification:', error);
  }
};

export const sendMotivationNotification = async () => {
  try {
    const quote = getRandomMotivation(MOTIVATIONAL_QUOTES.selfControl);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Motivation Boost',
        body: quote,
        data: { type: 'motivation' },
        sound: true,
      },
      trigger: 1,
    });
  } catch (error) {
    console.error('Error sending motivation notification:', error);
  }
};

export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

export const setupDailyNotifications = async (
  enableMorning,
  enableEvening,
  enableNight
) => {
  try {
    await cancelAllNotifications();

    if (enableMorning) await sendMorningNotification();
    if (enableEvening) await sendEveningNotification();
    if (enableNight) await sendNightNotification();
  } catch (error) {
    console.error('Error setting up daily notifications:', error);
  }
};

// Add notification response listener
export const addNotificationResponseListener = (callback) => {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    callback(response.notification.request.content.data);
  });
};
