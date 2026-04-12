import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useHabit } from '../context/HabitContext';
import {
  getTaskCompletionPercentage,
  getCurrentTaskStreak,
  getBestTaskStreak,
  generateTaskInsight,
  calculateOverallTaskMetrics,
  shouldTaskAppearToday,
} from '../utils/taskHelpers';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#667EEA',
  dark: '#1A202C',
  success: '#48BB78',
  warning: '#ED8936',
  danger: '#F56565',
};

export default function TaskAnalyticsScreen() {
  const { state } = useHabit();

  // Calculate metrics
  const metrics = useMemo(() => {
    return calculateOverallTaskMetrics(state.customTasks, state.taskCompletions);
  }, [state.customTasks, state.taskCompletions]);

  // Get task analytics
  const taskAnalytics = useMemo(() => {
    return state.customTasks
      .filter((task) => shouldTaskAppearToday(task))
      .map((task) => ({
        id: task.id,
        name: task.name,
        repeatType: task.repeatType,
        completionPercentage: getTaskCompletionPercentage(task.id, state.taskCompletions, 7),
        currentStreak: getCurrentTaskStreak(task.id, state.taskCompletions),
        bestStreak: getBestTaskStreak(task.id, state.taskCompletions),
        pointsReward: task.pointsReward,
        insight: generateTaskInsight(
          task.name,
          getTaskCompletionPercentage(task.id, state.taskCompletions, 7),
          getCurrentTaskStreak(task.id, state.taskCompletions)
        ),
      }));
  }, [state.customTasks, state.taskCompletions]);

  // Get last 7 days data for a task
  const getLast7DaysData = (taskId) => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasCompletion = state.taskCompletions.some(
        (log) => log.taskId === taskId && log.dateCompleted === dateStr
      );
      dates.push({ date: dateStr, completed: hasCompletion ? 1 : 0 });
    }
    return dates;
  };

  // Component: Overall stats card
  const OverallStatsCard = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Overall Statistics</Text>

      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Tasks</Text>
          <Text style={styles.statValue}>{metrics.totalTasks}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Avg Completion</Text>
          <Text style={[styles.statValue, { color: COLORS.success }]}>
            {metrics.overallCompletion}%
          </Text>
        </View>
      </View>

      {metrics.mostConsistentTask && (
        <View style={styles.highlightBox}>
          <Ionicons name="star" size={20} color={COLORS.warning} />
          <View style={styles.highlightText}>
            <Text style={styles.highlightLabel}>Most Consistent</Text>
            <Text style={styles.highlightValue}>
              {metrics.mostConsistentTask.name} ({metrics.mostConsistentTask.percentage}%)
            </Text>
          </View>
        </View>
      )}

      {metrics.leastPerformingTask && (
        <View style={[styles.highlightBox, { backgroundColor: 'rgba(245, 101, 101, 0.1)' }]}>
          <Ionicons name="alert-circle" size={20} color={COLORS.danger} />
          <View style={styles.highlightText}>
            <Text style={styles.highlightLabel}>Needs Focus</Text>
            <Text style={styles.highlightValue}>
              {metrics.leastPerformingTask.name} ({metrics.leastPerformingTask.percentage}%)
            </Text>
          </View>
        </View>
      )}

      {metrics.tasksAtRisk.length > 0 && (
        <View style={[styles.highlightBox, { backgroundColor: 'rgba(237, 137, 54, 0.1)' }]}>
          <Ionicons name="warning" size={20} color={COLORS.warning} />
          <View style={styles.highlightText}>
            <Text style={styles.highlightLabel}>At Risk</Text>
            <Text style={styles.highlightValue}>
              {metrics.tasksAtRisk.map((t) => t.name).join(', ')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  // Component: Individual task analytics
  const TaskAnalyticsCard = ({ task }) => {
    const weekData = getLast7DaysData(task.id);
    const maxBarHeight = 50;

    // Color based on performance
    const getPerformanceColor = (percentage) => {
      if (percentage === 100) return '#48BB78';
      if (percentage >= 75) return '#667EEA';
      if (percentage >= 50) return '#ED8936';
      return '#F56565';
    };

    const performanceColor = getPerformanceColor(task.completionPercentage);

    return (
      <View style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View>
            <Text style={styles.taskName}>{task.name}</Text>
            <Text style={styles.taskType}>
              {task.repeatType === 'daily' ? '🔄 Daily' : '📅 Weekly'} • {task.pointsReward} pts
            </Text>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: performanceColor }]}>
              <Text style={styles.badgeText}>{task.completionPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Streak info */}
        <View style={styles.streakRow}>
          <View style={styles.streakItem}>
            <Text style={styles.streakLabel}>Current Streak</Text>
            <Text style={[styles.streakValue, { color: COLORS.primary }]}>
              {task.currentStreak} 🔥
            </Text>
          </View>
          <View style={styles.streakItem}>
            <Text style={styles.streakLabel}>Best Streak</Text>
            <Text style={[styles.streakValue, { color: COLORS.success }]}>
              {task.bestStreak} 🏆
            </Text>
          </View>
        </View>

        {/* Bar chart for last 7 days */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>Last 7 Days</Text>
          <View style={styles.barChart}>
            {weekData.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: item.completed ? maxBarHeight : 4,
                      backgroundColor: item.completed ? performanceColor : '#3E4C59',
                    },
                  ]}
                />
                <Text style={styles.dayLabel}>
                  {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insight */}
        <View
          style={[
            styles.insightBox,
            {
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderLeftColor: performanceColor,
            },
          ]}
        >
          <Ionicons name="bulb" size={16} color={performanceColor} />
          <Text style={[styles.insightText, { color: '#fff' }]}>{task.insight}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Task Analytics</Text>
        <Text style={styles.subtitle}>Track your task completion patterns</Text>
      </View>

      {/* Overall Stats */}
      {state.customTasks.length > 0 ? (
        <>
          <OverallStatsCard />

          {/* Individual Tasks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance by Task</Text>
            {taskAnalytics.length > 0 ? (
              taskAnalytics.map((task) => (
                <TaskAnalyticsCard key={task.id} task={task} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={40} color="#95A3AD" />
                <Text style={styles.emptyText}>No tasks today</Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="stats-chart-outline" size={48} color="#95A3AD" />
          <Text style={styles.emptyText}>No task data yet</Text>
          <Text style={styles.emptySubtext}>Create tasks to see analytics</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#95A3AD',
    marginBottom: 20,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#2D3748',
    borderRadius: 16,
    padding: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#3E4C59',
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 11,
    color: '#95A3AD',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(237, 137, 54, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  highlightText: {
    marginLeft: 12,
    flex: 1,
  },
  highlightLabel: {
    fontSize: 11,
    color: '#95A3AD',
    fontWeight: '600',
  },
  highlightValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: '#2D3748',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  taskName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  taskType: {
    fontSize: 12,
    color: '#95A3AD',
    marginTop: 4,
  },
  badgeContainer: {
    alignItems: 'center',
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  streakRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  streakItem: {
    flex: 1,
    backgroundColor: '#3E4C59',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 11,
    color: '#95A3AD',
    fontWeight: '600',
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  chartContainer: {
    marginBottom: 12,
  },
  chartLabel: {
    fontSize: 12,
    color: '#95A3AD',
    fontWeight: '600',
    marginBottom: 8,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
    backgroundColor: '#3E4C59',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    height: '100%',
  },
  bar: {
    width: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 9,
    color: '#95A3AD',
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  insightText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#95A3AD',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#5A6C7D',
    marginTop: 4,
  },
});
