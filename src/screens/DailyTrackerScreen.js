import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { useHabit } from '../context/HabitContext';
import { COLORS, HABIT_TARGETS } from '../constants';
import { getToday } from '../utils/helpers';
import { isTaskCompletedToday, shouldTaskAppearToday } from '../utils/taskHelpers';
import { Ionicons } from '@expo/vector-icons';

export default function DailyTrackerScreen() {
  const { state, logHabit, completeCustomTask } = useHabit();
  const today = getToday();
  const todayData = state.dailyData[today] || {};

  const [smoking, setSmoking] = useState(todayData.smoking || 0);
  const [privateActivity, setPrivateActivity] = useState(todayData.privateActivity || false);
  const [sleepHours, setSleepHours] = useState(todayData.sleep?.toString() || '');
  const [workout, setWorkout] = useState(todayData.workout || false);

  // Get custom tasks that should appear today
  const customTasksToday = state.customTasks.filter((task) => shouldTaskAppearToday(task) && task.isActive);

  const handleSmokingChange = (value) => {
    const numValue = parseInt(value) || 0;
    setSmoking(numValue);
    logHabit('smoking', numValue);
  };

  const handlePrivateActivityChange = () => {
    const newValue = !privateActivity;
    setPrivateActivity(newValue);
    logHabit('privateActivity', newValue ? 1 : 0);
  };

  const handleSleepChange = (value) => {
    setSleepHours(value);
    if (value) {
      logHabit('sleep', parseFloat(value));
    }
  };

  const handleWorkoutChange = () => {
    const newValue = !workout;
    setWorkout(newValue);
    logHabit('workout', newValue ? 1 : 0);
  };

  const HabitTracker = ({ habit, value, onChange, type, label, target, color }) => (
    <View style={[styles.trackerCard, { borderLeftColor: color }]}>
      <View style={styles.trackerHeader}>
        <Text style={styles.trackerLabel}>{label}</Text>
        <View style={styles.targetBadge}>
          <Text style={styles.targetText}>Goal: {target} {HABIT_TARGETS[habit].unit}</Text>
        </View>
      </View>

      {type === 'number' ? (
        <View style={styles.numberInput}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSmokingChange(Math.max(0, smoking - 1))}
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={value.toString()}
            onChangeText={handleSmokingChange}
            keyboardType="number-pad"
            maxLength={2}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSmokingChange(smoking + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : type === 'boolean' ? (
        <View style={styles.toggleContainer}>
          <Switch
            value={value}
            onValueChange={onChange}
            trackColor={{ false: '#3E4C59', true: color }}
            thumbColor={value ? '#fff' : '#95A3AD'}
            style={styles.switch}
          />
          <Text style={styles.toggleText}>{value ? 'Completed' : 'Not completed'}</Text>
        </View>
      ) : (
        <View style={styles.sleepInput}>
          <TextInput
            style={styles.sleepField}
            value={value}
            onChangeText={onChange}
            placeholder="Enter hours"
            placeholderTextColor="#95A3AD"
            keyboardType="decimal-pad"
            maxLength={3}
          />
          <Text style={styles.sleepUnit}>hours</Text>
        </View>
      )}

      <Text style={styles.trackerStatus}>
        {type === 'number' && `${value} ${HABIT_TARGETS[habit].unit}`}
        {type === 'boolean' && (value ? '✓ Done!' : '⏳ Pending')}
        {type === 'sleep' && (value ? `${value} hrs` : 'Not logged')}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today&apos;s Habits</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        })}</Text>
      </View>

      <View style={styles.content}>
        <HabitTracker
          habit="smoking"
          value={smoking}
          onChange={handleSmokingChange}
          type="number"
          label="Cigarettes Today"
          target={state.habits.smoking.target}
          color={state.habits.smoking.color}
        />

        <HabitTracker
          habit="privateActivity"
          value={privateActivity}
          onChange={handlePrivateActivityChange}
          type="boolean"
          label="Private Activity"
          target={state.habits.privateActivity.target}
          color={state.habits.privateActivity.color}
        />

        <HabitTracker
          habit="workout"
          value={workout}
          onChange={handleWorkoutChange}
          type="boolean"
          label="Workout/Exercise"
          target={state.habits.workout.target}
          color={state.habits.workout.color}
        />

        <HabitTracker
          habit="sleep"
          value={sleepHours}
          onChange={handleSleepChange}
          type="sleep"
          label="Sleep Duration"
          target={state.habits.sleep.target}
          color={state.habits.sleep.color}
        />

        {/* Custom Tasks */}
        {customTasksToday.length > 0 && (
          <>
            <Text style={styles.customTasksTitle}>My Custom Tasks</Text>
            {customTasksToday.map((task) => {
              const isCompleted = isTaskCompletedToday(task, state.taskCompletions);
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[
                    styles.customTaskCard,
                    isCompleted && styles.customTaskCardCompleted,
                  ]}
                  onPress={() => {
                    if (!isCompleted) {
                      const completion = {
                        taskId: task.id,
                        dateCompleted: today,
                        completedAt: new Date().toISOString(),
                        points: task.pointsReward,
                        dayOfWeek: new Date().getDay(),
                      };
                      completeCustomTask(completion);
                    }
                  }}
                >
                  <View style={styles.customTaskContent}>
                    <View style={styles.customTaskCheckbox}>
                      {isCompleted ? (
                        <Ionicons name="checkmark-circle" size={24} color="#48BB78" />
                      ) : (
                        <Ionicons name="ellipse-outline" size={24} color="#95A3AD" />
                      )}
                    </View>
                    <View style={styles.customTaskInfo}>
                      <Text
                        style={[
                          styles.customTaskName,
                          isCompleted && styles.customTaskNameCompleted,
                        ]}
                      >
                        {task.name}
                      </Text>
                      <Text style={styles.customTaskPoints}>+{task.pointsReward} pts</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </View>

      {/* Completion Check */}
      <View style={styles.completionCard}>
        <Text style={styles.completionTitle}>Daily Completion</Text>
        <View style={styles.completionList}>
          <View style={styles.completionItem}>
            <Text style={styles.completionCheckmark}>
              {smoking <= 5 ? '✓' : '−'}
            </Text>
            <Text style={styles.completionText}>Reduced smoking</Text>
          </View>
          <View style={styles.completionItem}>
            <Text style={styles.completionCheckmark}>
              {privateActivity ? '✓' : '−'}
            </Text>
            <Text style={styles.completionText}>Private Activity</Text>
          </View>
          <View style={styles.completionItem}>
            <Text style={styles.completionCheckmark}>
              {workout ? '✓' : '−'}
            </Text>
            <Text style={styles.completionText}>Exercised</Text>
          </View>
          <View style={styles.completionItem}>
            <Text style={styles.completionCheckmark}>
              {sleepHours && parseFloat(sleepHours) >= 7 ? '✓' : '−'}
            </Text>
            <Text style={styles.completionText}>Good sleep</Text>
          </View>
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
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 15,
  },
  trackerCard: {
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
  },
  trackerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  trackerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  targetBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  targetText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  numberInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    marginHorizontal: 15,
    backgroundColor: '#1A202C',
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switch: {
    marginRight: 15,
  },
  toggleText: {
    fontSize: 14,
    color: '#fff',
  },
  sleepInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sleepField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  sleepUnit: {
    fontSize: 14,
    color: '#95A3AD',
    marginLeft: 10,
  },
  trackerStatus: {
    fontSize: 12,
    color: '#95A3AD',
    marginTop: 10,
  },
  completionCard: {
    backgroundColor: '#2D3748',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  completionList: {
    gap: 10,
  },
  completionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionCheckmark: {
    fontSize: 18,
    marginRight: 10,
    width: 25,
  },
  completionText: {
    fontSize: 14,
    color: '#CBD5E0',
  },
  customTasksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#95A3AD',
    marginTop: 15,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customTaskCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customTaskCardCompleted: {
    backgroundColor: 'rgba(72, 187, 120, 0.1)',
    borderLeftColor: '#48BB78',
    opacity: 0.7,
  },
  customTaskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customTaskCheckbox: {
    marginRight: 14,
  },
  customTaskInfo: {
    flex: 1,
  },
  customTaskName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  customTaskNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#95A3AD',
  },
  customTaskPoints: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
