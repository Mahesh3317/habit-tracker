import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useHabit } from '../context/HabitContext';
import { COLORS } from '../constants';
import { setupDailyNotifications } from '../services/notificationService';

export default function SettingsScreen() {
  const { state, toggleNotification } = useHabit();
  const [notifications, setNotifications] = useState(state.notifications);

  const handleNotificationToggle = async (type) => {
    const newNotifications = { ...notifications, [type]: !notifications[type] };
    setNotifications(newNotifications);
    toggleNotification(type);

    // Reconfigure notifications
    await setupDailyNotifications(
      newNotifications.morning,
      newNotifications.evening,
      newNotifications.night
    );
  };

  const SettingItem = ({ icon, title, description, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{icon} {title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#3E4C59', true: COLORS.primary }}
        thumbColor={value ? '#fff' : '#95A3AD'}
      />
    </View>
  );

  const GoalCard = ({ habit, name, current, target }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalInfo}>
        <Text style={styles.goalName}>{name}</Text>
        <Text style={styles.goalCurrent}>Current: {current}</Text>
      </View>
      <Text style={styles.goalTarget}>{target} target</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Notifications</Text>
        <View style={styles.settingsCard}>
          <SettingItem
            icon="🌅"
            title="Morning Motivation"
            description="Get inspired at 6:00 AM"
            value={notifications.morning}
            onToggle={() => handleNotificationToggle('morning')}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="⚠️"
            title="Evening Warning"
            description="Avoid temptations at 6:00 PM"
            value={notifications.evening}
            onToggle={() => handleNotificationToggle('evening')}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="🌙"
            title="Night Sleep Reminder"
            description="Rest reminder at 10:00 PM"
            value={notifications.night}
            onToggle={() => handleNotificationToggle('night')}
          />
        </View>
      </View>

      {/* Goals Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Goals & Targets</Text>
        <View style={styles.goalsContainer}>
          <GoalCard
            habit="smoking"
            name="Reduce Smoking"
            current={0}
            target="0 cigarettes"
          />
          <GoalCard
            habit="masturbation"
            name="Avoid Masturbation"
            current={state.dailyData[new Date().toISOString().split('T')[0]]?.masturbation ? 'Success' : 'Active'}
            target="100% success"
          />
          <GoalCard
            habit="workout"
            name="Daily Exercise"
            current={state.dailyData[new Date().toISOString().split('T')[0]]?.workout ? 'Done' : 'Pending'}
            target="Daily"
          />
          <GoalCard
            habit="sleep"
            name="Get Enough Sleep"
            current={state.dailyData[new Date().toISOString().split('T')[0]]?.sleep || '?'}
            target="7-9 hours"
          />
        </View>
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ About the App</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>App Name</Text>
            <Text style={styles.infoValue}>Self Control & Habit Tracker</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Purpose</Text>
            <Text style={styles.infoValue}>Break bad habits and build discipline</Text>
          </View>
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Tips for Success</Text>
        <View style={styles.tipsCard}>
          <Text style={styles.tipItem}>✓ Log your data daily for accurate tracking</Text>
          <Text style={styles.tipItem}>✓ Use the Urge Control feature immediately</Text>
          <Text style={styles.tipItem}>✓ Enable all notifications for support</Text>
          <Text style={styles.tipItem}>✓ Celebrate small wins with points & badges</Text>
          <Text style={styles.tipItem}>✓ Focus on building 1-2 habits at a time</Text>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Data Management</Text>
        <TouchableOpacity style={styles.dataButton}>
          <Text style={styles.dataButtonText}>📥 Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dataButton, styles.dangerButton]}>
          <Text style={styles.dataButtonText}>🗑️ Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {/* Credits */}
      <View style={styles.creditsSection}>
        <Text style={styles.creditsText}>Built with ❤️ to help you build better habits</Text>
        <Text style={styles.creditsSubtext}>You have the power to change your life</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 15,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#2D3748',
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  settingContent: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 12,
    color: '#95A3AD',
  },
  divider: {
    height: 1,
    backgroundColor: '#1A202C',
  },
  goalsContainer: {
    marginHorizontal: 15,
    gap: 10,
  },
  goalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  goalCurrent: {
    fontSize: 12,
    color: '#95A3AD',
  },
  goalTarget: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  infoCard: {
    backgroundColor: '#2D3748',
    marginHorizontal: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoItem: {
    padding: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#95A3AD',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#1A202C',
  },
  tipsCard: {
    backgroundColor: '#2D3748',
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 12,
  },
  tipItem: {
    fontSize: 13,
    color: '#CBD5E0',
    marginBottom: 8,
    lineHeight: 20,
  },
  dataButton: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#F56565',
  },
  dataButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  creditsSection: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  creditsText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
  },
  creditsSubtext: {
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
});
