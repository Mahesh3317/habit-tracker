import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary: getDerivedStateFromError called with:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.title}>⚠️ App Error</Text>
            <Text style={styles.label}>Error Message:</Text>
            <Text style={styles.message}>
              {this.state.error?.message || 'Unknown error occurred'}
            </Text>
            <Text style={styles.label}>Error Type:</Text>
            <Text style={styles.message}>
              {this.state.error?.name || typeof this.state.error}
            </Text>
            {this.state.errorInfo && (
              <>
                <Text style={styles.label}>Component Stack:</Text>
                <Text style={styles.stack}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </>
            )}
            <Text style={styles.label}>Stack Trace:</Text>
            <Text style={styles.stack}>
              {this.state.error?.stack || 'No stack trace available'}
            </Text>
          </ScrollView>
          <Text style={styles.footer}>
            Please restart the app by closing and reopening it.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1A202C',
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#96CEB4',
    marginTop: 15,
    marginBottom: 5,
  },
  message: {
    fontSize: 13,
    color: '#E2E8F0',
    backgroundColor: '#2D3748',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  stack: {
    fontSize: 11,
    color: '#CBD5E0',
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  footer: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
});
    fontSize: 16,
    color: '#FF6B6B',
    marginBottom: 10,
    textAlign: 'center',
  },
  stack: {
    fontSize: 12,
    color: '#95A3AD',
    marginTop: 10,
    fontFamily: 'monospace',
  },
});
