import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useHabit } from '../context/HabitContext';
import { COLORS, MOTIVATIONAL_QUOTES, URGE_ALTERNATIVES } from '../constants';
import { getRandomMotivation, formatTime } from '../utils/helpers';
import { sendUrgeNotification } from '../services/notificationService';

export default function UrgeControlScreen() {
  const { state, setUrgeTimer } = useHabit();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [motivation, setMotivation] = useState('');
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    setMotivation(getRandomMotivation(MOTIVATIONAL_QUOTES.selfControl));
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const startUrgeControl = async () => {
    setIsTimerActive(true);
    setTimeLeft(300);
    setMotivation(getRandomMotivation(MOTIVATIONAL_QUOTES.selfControl));
    await sendUrgeNotification();

    Animated.timing(animationValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleTimerComplete = () => {
    setMotivation('✨ You did it! You resisted the urge!');
    setTimeLeft(0);
    setUrgeTimer(null);
  };

  const stopTimer = () => {
    setIsTimerActive(false);
    setTimeLeft(300);
  };

  const skipUrge = () => {
    setMotivation(getRandomMotivation(MOTIVATIONAL_QUOTES.confidence));
    setTimeLeft(300);
    setIsTimerActive(false);
  };

  const AlternativeAction = ({ action }) => (
    <TouchableOpacity style={styles.actionCard}>
      <Text style={styles.actionIcon}>{action.icon}</Text>
      <View style={styles.actionContent}>
        <Text style={styles.actionName}>{action.name}</Text>
        <Text style={styles.actionDuration}>{action.duration}</Text>
      </View>
      <Text style={styles.actionArrow}>→</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Main CTA */}
      <View style={styles.header}>
        <Text style={styles.title}>I Feel an Urge</Text>
        <Text style={styles.subtitle}>Click below to start 5-minute distraction timer</Text>
      </View>

      {!isTimerActive ? (
        <TouchableOpacity
          style={styles.mainButton}
          onPress={startUrgeControl}
        >
          <Text style={styles.mainButtonEmoji}>💪</Text>
          <Text style={styles.mainButtonText}>Start Emergency Timer</Text>
          <Text style={styles.mainButtonSub}>5 minutes to regain control</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.timerSection}>
          {/* Timer Display */}
          <View style={styles.timerCard}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>Time Remaining</Text>
          </View>

          {/* Motivation Display */}
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>{motivation}</Text>
          </View>

          {/* Timer Controls */}
          <View style={styles.timerControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.pauseButton]}
              onPress={stopTimer}
            >
              <Text style={styles.controlButtonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.skipButton]}
              onPress={skipUrge}
            >
              <Text style={styles.controlButtonText}>I'm Fine Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Alternative Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Try These Instead (5-10 min)</Text>
        <View style={styles.alternativesContainer}>
          {URGE_ALTERNATIVES.map((action, index) => (
            <AlternativeAction key={index} action={action} />
          ))}
        </View>
      </View>

      {/* Tips & Strategies */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>🧠 Urge Science</Text>
          <Text style={styles.tipText}>
            Urges typically last 5-15 minutes. By distracting yourself, you can ride out the wave and emerge stronger.
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💨 Breathing Technique</Text>
          <Text style={styles.tipText}>
            Try 4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.
          </Text>
        </View>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>❄️ Cold Shock Method</Text>
          <Text style={styles.tipText}>
            Splash cold water on your face or take a cold shower. This resets your nervous system.
          </Text>
        </View>
      </View>

      {/* Streak Info */}
      <View style={styles.streakSection}>
        <Text style={styles.streakTitle}>Current Streaks</Text>
        <View style={styles.streakRow}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakLabel}>No Smoking</Text>
            <Text style={styles.streakNumber}>0</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakLabel}>Abstinent</Text>
            <Text style={styles.streakNumber}>0</Text>
          </View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakLabel}>Exercise</Text>
            <Text style={styles.streakNumber}>0</Text>
          </View>
        </View>
        <Text style={styles.motivationalText}>
          Don't break your streak! You've got this! 💪
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  mainButton: {
    margin: 20,
    padding: 30,
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  mainButtonEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  mainButtonSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  timerSection: {
    padding: 20,
  },
  timerCard: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
  },
  motivationCard: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  motivationText: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  timerControls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#ED8936',
  },
  skipButton: {
    backgroundColor: COLORS.primary,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  alternativesContainer: {
    gap: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
  },
  actionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 3,
  },
  actionDuration: {
    fontSize: 12,
    color: '#95A3AD',
  },
  actionArrow: {
    fontSize: 16,
    color: COLORS.primary,
  },
  tipCard: {
    backgroundColor: '#2D3748',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#CBD5E0',
    lineHeight: 20,
  },
  streakSection: {
    padding: 20,
    backgroundColor: '#2D3748',
    marginTop: 20,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
  },
  streakLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  motivationalText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
});
