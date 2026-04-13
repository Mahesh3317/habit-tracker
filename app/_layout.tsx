import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { HabitProvider } from '../src/context/HabitContext';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

const COLORS = {
  primary: '#667EEA',
  dark: '#1A202C',
};

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <HabitProvider>
        <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#95A3AD',
          tabBarStyle: {
            backgroundColor: COLORS.dark,
            borderTopColor: '#2D3748',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tracker"
          options={{
            title: 'Track',
            tabBarIcon: ({ color }) => <Ionicons name="checkbox-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="urge"
          options={{
            title: 'Urge SOS',
            tabBarIcon: ({ color }) => <Ionicons name="alert-circle" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
          }}
        />
      </Tabs>
      <StatusBar style="light" />
      </HabitProvider>
    </ErrorBoundary>
  );
}
