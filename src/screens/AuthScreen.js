/**
 * AuthScreen — Login & Sign-Up
 *
 * A single screen that toggles between:
 *   • Login form   (email + password)
 *   • Sign-up form (display name + email + password + confirm password)
 *
 * Uses Firebase email/password authentication via AuthContext.
 * Matches the app's existing dark colour scheme.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// ─── Colour tokens (match the rest of the app) ───────────────────────────────
const COLORS = {
  primary: '#667EEA',
  dark: '#1A202C',
  card: '#2D3748',
  border: '#4A5568',
  text: '#FFFFFF',
  muted: '#95A3AD',
  danger: '#F56565',
  success: '#48BB78',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function AuthScreen() {
  const { signUp, logIn } = useAuth();

  // Toggle between 'login' and 'signup' modes
  const [mode, setMode] = useState('login');

  // Form fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ── Helpers ──────────────────────────────────────────────────────────────

  const clearForm = () => {
    setDisplayName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const toggleMode = () => {
    clearForm();
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
  };

  /** Map Firebase auth error codes to human-readable messages. */
  const friendlyError = (err) => {
    const code = err?.code || '';
    console.log('[Auth Error] code:', code, '| message:', err?.message);
    switch (code) {
      case 'auth/invalid-email':            return 'Please enter a valid email address.';
      case 'auth/user-not-found':           return 'No account found with this email.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':       return 'Incorrect email or password.';
      case 'auth/email-already-in-use':     return 'An account with this email already exists.';
      case 'auth/weak-password':            return 'Password must be at least 6 characters.';
      case 'auth/too-many-requests':        return 'Too many attempts. Please wait a moment.';
      case 'auth/network-request-failed':   return 'Network error. Check your connection.';
      case 'auth/operation-not-allowed':    return 'Email/Password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.';
      case 'auth/configuration-not-found':  return 'Firebase project not configured. Check your firebaseConfig values.';
      case 'auth/api-key-not-valid':        return 'Invalid Firebase API key. Check src/config/firebase.js.';
      default:                              return `Error (${code || 'unknown'}): ${err?.message || 'Please try again.'}`;
    }
  };

  // ── Submit handlers ───────────────────────────────────────────────────────

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await logIn(email.trim(), password);
      // AuthContext's onAuthStateChanged fires → RootLayout re-renders → tabs appear
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp(email.trim(), password, displayName.trim());
      // onAuthStateChanged fires → user is set → tabs appear
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === 'login' ? handleLogin : handleSignUp;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appIcon}>🧠</Text>
          <Text style={styles.appName}>Self Control Tracker</Text>
          <Text style={styles.tagline}>Build discipline. Break bad habits.</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {mode === 'login'
              ? 'Sign in to sync your progress across devices.'
              : 'Sign up to save and sync your habit data.'}
          </Text>

          {/* Sign-up only: Display name */}
          {mode === 'signup' && (
            <View style={styles.field}>
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Mahesh"
                placeholderTextColor={COLORS.muted}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          )}

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.muted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              autoComplete="email"
            />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              placeholderTextColor={COLORS.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType={mode === 'signup' ? 'next' : 'done'}
              onSubmitEditing={mode === 'login' ? handleSubmit : undefined}
            />
          </View>

          {/* Sign-up only: Confirm password */}
          {mode === 'signup' && (
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor={COLORS.muted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>
          )}

          {/* Error message */}
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle mode */}
          <TouchableOpacity style={styles.toggleRow} onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {mode === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Text style={styles.toggleLink}>
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer note */}
        <Text style={styles.footer}>
          Your data is securely stored in Firebase and syncs across all your devices.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.muted,
  },
  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginBottom: 20,
    lineHeight: 18,
  },
  // Form
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.dark,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
  },
  // Error
  errorBox: {
    backgroundColor: 'rgba(245, 101, 101, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    lineHeight: 18,
  },
  // Button
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Toggle
  toggleRow: {
    alignItems: 'center',
  },
  toggleText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  toggleLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Footer
  footer: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});
