// Notifications disabled for build - will re-enable after successful build
// import * as Notifications from 'expo-notifications';
// import * as TaskManager from 'expo-task-manager';
import { MOTIVATIONAL_QUOTES, URGE_ALTERNATIVES } from '../constants';
import { getRandomMotivation } from '../utils/helpers';

// Notification handler disabled
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

export const initializeNotifications = async () => {
  // Notifications disabled temporarily
  console.log('Notifications temporarily disabled');
  return true;
};

export const sendMorningNotification = async () => {
  console.log('Morning notification temporarily disabled');
};

export const sendEveningNotification = async () => {
  console.log('Evening notification temporarily disabled');
};

export const sendNightNotification = async () => {
  console.log('Night notification temporarily disabled');
};

export const sendUrgeNotification = async () => {
  console.log('Urge notification temporarily disabled');
};

export const sendStreakNotification = async (habit, streak) => {
  console.log(`Streak notification for ${habit} (${streak} days) temporarily disabled`);
};

export const sendMotivationNotification = async () => {
  console.log('Motivation notification temporarily disabled');
};

export const cancelAllNotifications = async () => {
  console.log('Cancel notifications temporarily disabled');
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
