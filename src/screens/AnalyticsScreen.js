import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useHabit } from '../context/HabitContext';
import {
  getMonthData,
  getWeekData,
  calculateReduction,
  getStreakColor,
  getAchievementBadge,
  calculateStreak,
} from '../utils/helpers';

// Color constants
const COLORS = {
  dark: '#1A202C',
  primary: '#667EEA',
};

export default function AnalyticsScreen() {
  const { state } = useHabit();
  const [timeRange, setTimeRange] = useState('week'); // 'week' or 'month'

  // Calculate data for all habits
  const getChartData = () => {
    const data = {};
    if (state.habits) {
      Object.keys(state.habits).forEach((habit) => {
        if (timeRange === 'week') {
          data[habit] = getWeekData(state.dailyData, habit);
        } else {
          data[habit] = getMonthData(state.dailyData, habit);
        }
      });
    }
    return data;
  };

  const chartData = getChartData();

  const SimpleChart = ({ data, habit }) => {
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    return (
      <View style={styles.chartContainer}>
        <View style={styles.bars}>
          {data.map((item, index) => (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barLabelContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (item.value / maxValue) * 100,
                      backgroundColor: state.habits[habit].color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.date}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const HabitAnalytics = ({ habit, habitData }) => {
    const streak = calculateStreak(state.dailyData, habit, habitData.target);
    const reduction = calculateReduction(state.dailyData, habit, habitData.target);

    return (
      <View key={habit} style={styles.habitAnalyticsCard}>
        <View style={[styles.habitHeader, { backgroundColor: habitData.color + '20' }]}>
          <View>
            <Text style={styles.habitNameLarge}>{habitData.name}</Text>
            <Text style={styles.habitStreak}>
              {streak}-day streak {getAchievementBadge(streak) || ''}
            </Text>
          </View>
          <Text style={[styles.streakBadge, { color: getStreakColor(streak) }]}>
            {streak}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statUnit}>days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>{reduction}%</Text>
            <Text style={styles.statUnit}>improvement</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Target</Text>
            <Text style={styles.statValue}>{habitData.target}</Text>
            <Text style={styles.statUnit}>daily</Text>
          </View>
        </View>

        {/* Chart */}
        {chartData[habit] && (
          <View style={styles.chartWrapper}>
            <Text style={styles.chartTitle}>
              {timeRange === 'week' ? '7-Day' : '30-Day'} Trend
            </Text>
            <SimpleChart
              data={chartData[habit]}
              habit={habit}
            />
          </View>
        )}

        {/* Insights */}
        <View style={styles.insightCard}>
          <Text style={styles.insightTitle}>💡 Insight</Text>
          {reduction > 0 ? (
            <Text style={styles.insightText}>
              Great progress! You&apos;ve improved by {reduction}% compared to last week.
            </Text>
          ) : (
            <Text style={styles.insightText}>
              Keep building momentum. Small steps lead to big changes.
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics & Progress</Text>
        <Text style={styles.subtitle}>Track your improvement over time</Text>
      </View>

      {/* Time Range Selector */}
      <View style={styles.timeRangeContainer}>
        <TouchableOpacity
          style={[styles.timeButton, timeRange === 'week' && styles.timeButtonActive]}
          onPress={() => setTimeRange('week')}
        >
          <Text style={[
            styles.timeButtonText,
            timeRange === 'week' && styles.timeButtonTextActive
          ]}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeButton, timeRange === 'month' && styles.timeButtonActive]}
          onPress={() => setTimeRange('month')}
        >
          <Text style={[
            styles.timeButtonText,
            timeRange === 'month' && styles.timeButtonTextActive
          ]}>Month</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Points</Text>
            <Text style={styles.summaryValue}>{state.totalPoints}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Badges</Text>
            <Text style={styles.summaryValue}>{state.badges ? state.badges.length : 0}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Best Streak</Text>
            <Text style={styles.summaryValue}>
              {state.habits ? Math.max(...Object.keys(state.habits).map((habit) =>
                calculateStreak(state.dailyData, habit, state.habits[habit].target)
              ), 0) : 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Individual Habit Analytics */}
      <View style={styles.analyticsSection}>
        {state.habits && Object.keys(state.habits).map((habit) => (
          <HabitAnalytics
            key={habit}
            habit={habit}
            habitData={state.habits[habit]}
          />
        ))}
      </View>

      {/* Recommendations */}
      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>📈 Recommendations</Text>
        <Text style={styles.recommendationText}>
          • Focus on building consistency - even 1 day at a time counts{'\n'}
          • Set realistic daily targets{'\n'}
          • Use the Urge Control feature when struggling{'\n'}
          • Celebrate small wins with reward points
        </Text>
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
  timeRangeContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2D3748',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  timeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95A3AD',
  },
  timeButtonTextActive: {
    color: '#fff',
  },
  summarySection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#95A3AD',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  analyticsSection: {
    padding: 15,
  },
  habitAnalyticsCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  habitNameLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  habitStreak: {
    fontSize: 12,
    color: '#CBD5E0',
  },
  streakBadge: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1A202C',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#95A3AD',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 10,
    color: '#CBD5E0',
  },
  chartWrapper: {
    padding: 15,
  },
  chartTitle: {
    fontSize: 12,
    color: '#CBD5E0',
    marginBottom: 12,
    fontWeight: '600',
  },
  chartContainer: {
    height: 120,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barLabelContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 5,
  },
  barLabel: {
    fontSize: 10,
    color: '#95A3AD',
    marginTop: 5,
  },
  insightCard: {
    backgroundColor: '#1A202C',
    margin: 15,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  insightText: {
    fontSize: 12,
    color: '#CBD5E0',
    lineHeight: 18,
  },
  recommendationCard: {
    backgroundColor: COLORS.primary,
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
});
