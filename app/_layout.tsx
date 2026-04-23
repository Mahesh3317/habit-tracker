/**
 * Root Layout — Auth Gate + Tab Navigation
 *
 * Rendering tree:
 *
 *   ErrorBoundary
 *     └─ AuthProvider          ← Firebase auth state (user, loading, signUp, logIn, logOut)
 *          └─ AuthGate
 *               ├─ <LoadingScreen>  when Firebase is resolving persisted session
 *               ├─ <AuthScreen>     when no user is logged in
 *               └─ HabitProvider   ← Firestore-synced app state (only mounted when logged in)
 *                    └─ <Tabs>     ← the 6-tab navigation
 *
 * Key points:
 *   • HabitProvider only mounts after the user is authenticated, so it always has a valid userId.
 *   • AuthGate re-renders whenever auth state changes (login / logout).
 *   • The loading screen prevents a flash of the login screen on cold start.
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { HabitProvider } from '../src/context/HabitContext';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import AuthScreen from '../src/screens/AuthScreen';

const COLORS = {
  primary: '#667EEA',
  dark: '#1A202C',
};

// ─── Loading screen shown while Firebase checks persisted login ───────────────

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading…</Text>
    </View>
  );
}

// ─── Tab navigation (only shown when authenticated) ───────────────────────────

function AppTabs() {
  return (
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
  );
}

// ─── Auth gate — decides what to render based on auth state ──────────────────

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    // Firebase is resolving persisted credentials — show a brief spinner
    return <LoadingScreen />;
  }

  if (!user) {
    // Not logged in — show the login/signup screen
    return <AuthScreen />;
  }

  // Logged in — mount HabitProvider with the user's uid, then show tabs
  return (
    <HabitProvider userId={user.uid}>
      <AppTabs />
      <StatusBar style="light" />
    </HabitProvider>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ErrorBoundary>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#95A3AD',
    fontSize: 14,
  },
});
