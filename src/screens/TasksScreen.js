import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useHabit } from '../context/HabitContext';
import { COLORS } from '../constants';

export default function TasksScreen() {
  const { state, completeTask } = useHabit();

  const handleCompleteTask = (taskId, points) => {
    completeTask(taskId, points);
  };

  const TaskCard = ({ task, onComplete }) => (
    <View style={[styles.taskCard, task.completed && styles.taskCardCompleted]}>
      <TouchableOpacity
        style={styles.taskCheckbox}
        onPress={() => onComplete(task.id, 10)}
      >
        <Text style={styles.checkboxText}>
          {task.completed ? '✓' : '○'}
        </Text>
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskName,
            task.completed && styles.taskNameCompleted,
          ]}
        >
          {task.name}
        </Text>
      </View>

      <View style={styles.pointsBadge}>
        <Text style={styles.pointsText}>+{10}</Text>
      </View>
    </View>
  );

  const CompletedCount = () => {
    const completed = state.tasks.filter((t) => t.completed).length;
    return (
      <View style={styles.completedStats}>
        <Text style={styles.statsLabel}>Tasks Completed Today</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(completed / state.tasks.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.statsCount}>
          {completed} of {state.tasks.length}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Tasks</Text>
        <Text style={styles.subtitle}>Complete tasks to earn points</Text>
      </View>

      <View style={styles.content}>
        {/* Stats */}
        <CompletedCount />

        {/* Tasks List */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Today&apos;s Tasks</Text>
          {state.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
            />
          ))}
        </View>

        {/* Category: Habit Control */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>🎯 Habit Control</Text>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryText}>
              These tasks help you break bad habits and build better ones. Focus on one task at a time.
            </Text>
          </View>
        </View>

        {/* Category: Health */}
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>💪 Health & Wellness</Text>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryText}>
              Physical activity and sleep are crucial for willpower and discipline. Make these non-negotiable.
            </Text>
          </View>
        </View>

        {/* Rewards Info */}
        <View style={styles.rewardsSection}>
          <Text style={styles.rewardsTitle}>🎁 Rewards System</Text>
          <View style={styles.rewardLevel}>
            <Text style={styles.rewardText}>10 Points = 1 Task</Text>
            <Text style={styles.rewardDescription}>Small steps to big changes</Text>
          </View>
          <View style={styles.rewardLevel}>
            <Text style={styles.rewardText}>40 Points = Daily Bonus</Text>
            <Text style={styles.rewardDescription}>Complete all 4 tasks</Text>
          </View>
          <View style={styles.rewardLevel}>
            <Text style={styles.rewardText}>280 Points = Weekly Badge</Text>
            <Text style={styles.rewardDescription}>7 Complete Days</Text>
          </View>
        </View>

        {/* Motivation Card */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>✨</Text>
          <Text style={styles.motivationText}>
            Every small task completed today builds the discipline muscle. You&apos;re creating a better future version of yourself!
          </Text>
        </View>
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
  content: {
    padding: 15,
  },
  completedStats: {
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1A202C',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  statsCount: {
    fontSize: 12,
    color: '#95A3AD',
  },
  tasksSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskCardCompleted: {
    backgroundColor: '#1A202C',
    opacity: 0.7,
  },
  taskCheckbox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  taskNameCompleted: {
    color: '#95A3AD',
    textDecorationLine: 'line-through',
  },
  pointsBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  pointsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categorySection: {
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  categoryInfo: {
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 13,
    color: '#CBD5E0',
    lineHeight: 20,
  },
  rewardsSection: {
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  rewardLevel: {
    backgroundColor: '#1A202C',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 3,
  },
  rewardDescription: {
    fontSize: 12,
    color: '#95A3AD',
  },
  motivationCard: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  motivationEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  motivationText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
