import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { HabitProvider } from '../src/context/HabitContext';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { View, ActivityIndicator, Text } from 'react-native';

const COLORS = {
  primary: '#667EEA',
  dark: '#1A202C',
};

function RootContent() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('RootLayout: Initializing app');
    // Give React a chance to initialize all components
    const timer = setTimeout(() => {
      console.log('RootLayout: App ready');
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1A202C', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: '#FF6B6B', fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>Initialization Error</Text>
        <Text style={{ color: '#E2E8F0', fontSize: 14, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#1A202C', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#667EEA" />
        <Text style={{ color: '#E2E8F0', marginTop: 20 }}>Loading app...</Text>
      </View>
    );
  }

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

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <HabitProvider>
        <RootContent />
        <StatusBar style="light" />
      </HabitProvider>
    </ErrorBoundary>
  );
}
  );
}
