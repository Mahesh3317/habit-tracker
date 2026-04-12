import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useHabit } from '../context/HabitContext';
import { COLORS } from '../constants';
import {
  getToday,
  calculateStreak,
  getWeekProgress,
  getAchievementBadge,
} from '../utils/helpers';
import { getDailyTaskProgress } from '../utils/taskHelpers';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { state } = useHabit();
  const [streaks, setStreaks] = useState({});
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [taskProgress, setTaskProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  useEffect(() => {
    // Calculate streaks for all habits
    const newStreaks = {};
    Object.keys(state.habits).forEach((habit) => {
      newStreaks[habit] = calculateStreak(
        state.dailyData,
        habit,
        state.habits[habit].target
      );
    });
    setStreaks(newStreaks);

    // Calculate weekly progress
    const weekProgress = getWeekProgress(state.dailyData, state.habits);
    setProgress(weekProgress);

    // Calculate daily task progress
    const dailyTaskProgress = getDailyTaskProgress(state.customTasks, state.taskCompletions);
    setTaskProgress(dailyTaskProgress);
  }, [state.dailyData, state.habits, state.customTasks, state.taskCompletions]);

  const StreakCard = ({ habit, name, color, streak }) => (
    <View style={[styles.streakCard, { borderLeftColor: color }]}>
      <View style={styles.streakHeader}>
        <Text style={styles.habitName}>{name}</Text>
        <Text style={[styles.badge, { color }]}>{getAchievementBadge(streak)}</Text>
      </View>
      <Text style={[styles.streakCount, { color }]}>{streak}</Text>
      <Text style={styles.streakLabel}>day streak</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Let's Build Better Habits</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsLabel}>Total Points</Text>
          <Text style={styles.points}>{state.totalPoints}</Text>
        </View>
      </View>

      {/* Weekly Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercentage}>{progress.percentage}%</Text>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressDays}>
              {progress.completed} of {progress.total} days completed
            </Text>
            <Text style={styles.progressText}>Keep up the momentum!</Text>
          </View>
        </View>
      </View>

      {/* Today's Task Progress */}
      {state.customTasks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Routine</Text>
          <View 
            style={[
              styles.progressCard,
              { 
                backgroundColor: taskProgress.percentage >= 75 ? 'rgba(72, 187, 120, 0.1)' : 
                                  taskProgress.percentage >= 50 ? 'rgba(237, 137, 54, 0.1)' : 
                                  'rgba(245, 101, 101, 0.1)'
              }
            ]}
          >
            <View style={styles.progressCircle}>
              <Text style={[
                styles.progressPercentage,
                { 
                  color: taskProgress.percentage >= 75 ? '#48BB78' : 
                         taskProgress.percentage >= 50 ? '#ED8936' : 
                         '#F56565'
                }
              ]}>
                {taskProgress.percentage}%
              </Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressDays}>
                {taskProgress.completed} of {taskProgress.total} tasks completed
              </Text>
              <Text style={styles.progressText}>
                {taskProgress.percentage === 100 ? '🎉 Perfect day!' : 'Keep pushing!'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Streaks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Streaks</Text>
        {Object.keys(state.habits).map((habitKey) => (
          <StreakCard
            key={habitKey}
            habit={habitKey}
            name={state.habits[habitKey].name}
            color={state.habits[habitKey].color}
            streak={streaks[habitKey] || 0}
          />
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>📊 View Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🎯 Set Goals</Text>
        </TouchableOpacity>
      </View>

      {/* Badges */}
      {state.badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Badges Earned</Text>
          <View style={styles.badgesContainer}>
            {state.badges.map((badge, index) => (
              <View key={index} style={styles.badgeItem}>
                <Text style={styles.largeEmoji}>{badge.emoji}</Text>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  pointsContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
  },
  pointsLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  points: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 12,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressInfo: {
    flex: 1,
  },
  progressDays: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  streakCard: {
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  habitName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  badge: {
    fontSize: 20,
  },
  streakCount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  streakLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
  },
  largeEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  badgeName: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});
