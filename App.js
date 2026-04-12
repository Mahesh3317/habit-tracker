import React, { useEffect } from 'react';
import { HabitProvider } from './src/context/HabitContext';
import { initializeNotifications } from './src/services/notificationService';
import RootLayout from './app/_layout';

export default function App() {
  useEffect(() => {
    // Initialize notifications when app starts
    initializeNotifications();
  }, []);

  return (
    <HabitProvider>
      <RootLayout />
    </HabitProvider>
  );
}
