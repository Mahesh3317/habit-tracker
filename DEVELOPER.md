# Developer Guide - Extending Self Control & Habit Tracker

For developers who want to extend or customize this app.

## 📁 Project Architecture

```
project/
├── app/                      # Expo Router-based navigation
│   ├── _layout.tsx          # Tab navigation setup
│   └── [screen].tsx         # Screen files (index, tracker, etc.)
│
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # Global state (HabitContext.js)
│   ├── screens/             # Screen implementations
│   ├── services/            # Business logic (notifications, etc.)
│   ├── utils/               # Helper functions
│   └── constants/           # App configuration & data
│
├── package.json             # Dependencies
├── app.json                 # Expo configuration
└── README.md, QUICKSTART.md, FEATURES.md
```

## 🏗️ Adding New Features

### Example 1: Add a New Habit Type

1. **Update HabitContext.js**
```javascript
// In initialState > habits
habits: {
  // ... existing habits
  soberiety: {
    name: 'Stay Sober',
    target: 1,
    color: '#FFD700',
    streak: 0
  }
}
```

2. **Update DailyTrackerScreen.js**
```javascript
// Add new tracker input
<HabitTracker
  habit="sobriety"
  value={sobriety}
  onChange={handleSobrietyChange}
  type="boolean"
  label="Stay Sober"
  target={state.habits.sobriety.target}
  color={state.habits.sobriety.color}
/>
```

3. **Update Analytics**
- The analytics automatically calculate streaks for new habits

### Example 2: Add a New Screen

1. **Create screen file**
```bash
# src/screens/MyNewScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

export default function MyNewScreen() {
  return (
    <View style={styles.container}>
      <Text>My New Feature</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark }
});
```

2. **Add to navigation**
```typescript
// app/mynewscreen.tsx
import MyNewScreen from '../src/screens/MyNewScreen';
export default MyNewScreen;
```

3. **Add tab in _layout.tsx**
```typescript
<Tabs.Screen
  name="mynewscreen"
  options={{
    title: 'My Feature',
    tabBarIcon: ({ color }) => <Ionicons name="icon-name" size={24} color={color} />
  }}
/>
```

### Example 3: Add Firebase Integration

1. **Install Firebase**
```bash
npm install firebase
```

2. **Create Firebase service**
```javascript
// src/services/firebaseService.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_PROJECT_ID",
  // ...
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
```

3. **Sync with context**
```javascript
// In useEffect of component
import { db } from '../services/firebaseService';

useEffect(() => {
  const pushData = async () => {
    // Sync state with Firebase
  };
}, [state]);
```

## 🔧 Customization Examples

### Change Primary Color

**src/constants/index.js**
```javascript
export const COLORS = {
  primary: '#YOUR_COLOR_HEX',  // Change here
  // ... rest of colors
};
```

**Changes automatically apply to:**
- Buttons
- Headers
- Accents
- Tab bar

### Modify Motivational Quotes

**src/constants/index.js**
```javascript
export const MOTIVATIONAL_QUOTES = {
  discipline: [
    'Your new quote here',
    'Another inspiring quote',
  ],
  // ...
};
```

### Adjust Urge Timer Duration

**src/screens/UrgeControlScreen.js**
```javascript
const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 min
// Change 300 to desired seconds (e.g., 600 for 10 min)
```

### Add More Daily Tasks

**src/context/HabitContext.js**
```javascript
tasks: [
  { id: '1', name: 'Walk 20 minutes', completed: false, points: 10 },
  { id: '2', name: 'Avoid porn', completed: false, points: 15 },
  // Add new task
  { id: '5', name: 'Meditate 10 minutes', completed: false, points: 10 },
]
```

## 📚 Key APIs & Hooks

### useHabit() Hook
```javascript
import { useHabit } from '../context/HabitContext';

function MyComponent() {
  const {
    state,           // Current state
    logHabit,        // Log a habit value
    updateStreak,    // Update streak
    completeTask,    // Mark task complete
    addBadge,        // Add achievement
    setUrgeTimer,    // Set timer
    toggleNotification,  // Enable/disable notifications
  } = useHabit();

  // Usage
  logHabit('smoking', 5);
  completeTask('taskId', points);
}
```

### Helper Functions
```javascript
import {
  getToday,                    // Current date string
  calculateStreak,             // Calculate streak for habit
  getWeekData,                 // Get 7-day data
  getMonthData,                // Get 30-day data
  getRandomMotivation,         // Get random quote
  formatDate,                  // Format date nicely
  formatTime,                  // Format seconds to MM:SS
  getAchievementBadge,         // Get badge emoji for streak
} from '../utils/helpers';
```

### Notification Service
```javascript
import {
  initializeNotifications,     // Initialize on app start
  sendMorningNotification,     // Send morning notification
  sendUrgeNotification,        // Send urge help
  sendStreakNotification,      // Send milestone
  setupDailyNotifications,     // Configure all notifications
} from '../services/notificationService';
```

## 🧪 Testing

### Test Data Setup
```javascript
// In HabitContext, modify initialState for testing
const mockData = {
  '2024-01-15': {
    smoking: 5,
    masturbation: 1,
    workout: 1,
    sleep: 8
  },
  // Add more mock dates
};
```

### Manual Testing Checklist
- [ ] Log data for all habits
- [ ] Complete tasks
- [ ] Test Urge SOS timer
- [ ] Check streak calculations
- [ ] View analytics
- [ ] Enable/disable notifications
- [ ] Test on iOS and Android

## 🚀 Building for Production

### iOS Build
```bash
expo build:ios --public
```

### Android Build
```bash
expo build:android --public
```

### Create Eas Config
```bash
npm install -g eas-cli
eas init  # Create eas.json
eas build  # Build for production
```

## 🔒 Security Best Practices

1. **Never hardcode secrets**
   ```javascript
   // ❌ Bad
   const API_KEY = 'sk_live_123456789';

   // ✅ Good
   import { API_KEY } from '@env';
   ```

2. **Validate user input**
   ```javascript
   const validateSmokingCount = (value) => {
     const num = parseInt(value);
     return num >= 0 && num <= 50;
   };
   ```

3. **Sanitize data**
   ```javascript
   const sanitizeInput = (input) => {
     return input.trim().slice(0, 100);
   };
   ```

## 📊 Database Schema (for Firebase integration)

```javascript
{
  users: {
    userId: {
      profile: {
        name: "John",
        age: 25,
        joinDate: "2024-01-01"
      },
      dailyData: {
        "2024-01-15": {
          smoking: 5,
          masturbation: 1,
          workout: 1,
          sleep: 8
        }
      },
      streaks: {
        smoking: 5,
        masturbation: 3,
        workout: 7,
        sleep: 2
      },
      points: 240,
      badges: ["3-day", "7-day"]
    }
  }
}
```

## 🐛 Debugging

### Enable Debug Logging
```javascript
// In your component
import { useHabit } from '../context/HabitContext';

function MyComponent() {
  const { state } = useHabit();
  useEffect(() => {
    console.log('Current state:', state);
  }, [state]);
}
```

### Check AsyncStorage
```javascript
import AsyncStorage from '@react-native-community/async-storage';

// View saved data
const checkStorage = async () => {
  const data = await AsyncStorage.getItem('habitState');
  console.log('Saved state:', JSON.parse(data));
};
```

### Monitor Notifications
```javascript
import * as Notifications from 'expo-notifications';

// Check scheduled notifications
const checkNotifications = async () => {
  const scheduled = await Notifications.getPresentedNotificationsAsync();
  console.log('Notifications:', scheduled);
};
```

## 📈 Performance Optimization

### Memoization
```javascript
import { useMemo } from 'react';

const MyComponent = () => {
  const expensiveValue = useMemo(() => {
    return calculateStreak(...);
  }, [dependencies]);
};
```

### Lazy Loading
```javascript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default () => (
  <Suspense fallback={<LoadingSpinner />}>
    <HeavyComponent />
  </Suspense>
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit pull request

## 📄 Code Style

- Use meaningful variable names
- Write comments for complex logic
- Follow React best practices
- Use TypeScript for new files
- Keep components under 300 lines

## 🚀 Future Development Ideas

1. **Cloud Sync**
   - Firebase Realtime Database
   - Cross-device sync

2. **Social Features**
   - Friend challenges
   - Group support

3. **AI Features**
   - Predictive relapse detection
   - Personalized advice

4. **Health Integration**
   - Apple Health/Google Fit sync
   - Wearable integration

5. **Advanced Analytics**
   - ML-based predictions
   - Trigger identification

6. **Community**
   - User forum
   - Success stories
   - Peer support

---

Need help? Check app.json for Expo configuration details or package.json for all dependencies.
