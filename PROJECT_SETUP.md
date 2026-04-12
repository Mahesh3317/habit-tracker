# PROJECT SETUP & STRUCTURE

Complete guide to the Self Control & Habit Tracker mobile app setup.

## 🎯 Project Overview

**Self Control & Habit Tracker** is a React Native + Expo mobile application designed to help users:
- Break bad habits (smoking, masturbation addiction)
- Build positive routines (exercise, sleep, healthy eating)
- Track progress with streaks and achievements
- Get emergency support during urge moments

## 📱 Target Platform

- **Platforms:** iOS, Android, Web
- **Framework:** React Native with Expo
- **Performance:** Optimized for mobile devices
- **Storage:** Local device storage with AsyncStorage

## 📋 Installation Checklist

### Prerequisites
- [ ] Node.js v18+ installed
- [ ] npm or yarn package manager
- [ ] Mobile device (iOS or Android)
- [ ] Expo Go app on mobile device

### Setup Steps
```bash
# 1. Navigate to project
cd "Habit change\habit-tracker"

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Scan QR code with your phone's camera
# 5. Habit Tracker opens automatically!
```

## 🗂️ Complete Project Structure

```
habit-tracker/
│
├── 📂 app/                           # Expo Router Pages
│   ├── _layout.tsx                   # Tab navigation configuration
│   ├── index.tsx                     # Dashboard screen
│   ├── tracker.tsx                   # Daily tracker screen
│   ├── urge.tsx                      # Urge control screen
│   ├── tasks.tsx                     # Daily tasks screen
│   ├── analytics.tsx                 # Analytics/progress screen
│   ├── settings.tsx                  # Settings screen
│   └── (tabs)/                       # (Existing default structure)
│
├── 📂 src/                           # Source code
│   │
│   ├── 📂 components/                # Reusable UI Components
│   │   ├── HabitCard.js
│   │   ├── StreakBadge.js
│   │   ├── ProgressBar.js
│   │   └── [other components...]
│   │
│   ├── 📂 context/                   # State Management
│   │   └── HabitContext.js           # Global state + reducer
│   │
│   ├── 📂 screens/                   # Full Screen Components
│   │   ├── DashboardScreen.js        # Main overview
│   │   ├── DailyTrackerScreen.js     # Habit logging
│   │   ├── UrgeControlScreen.js      # Emergency support
│   │   ├── TasksScreen.js            # Daily tasks
│   │   ├── AnalyticsScreen.js        # Progress charts
│   │   └── SettingsScreen.js         # App settings
│   │
│   ├── 📂 services/                  # Business Logic
│   │   ├── notificationService.js    # Notification handling
│   │   ├── firebaseService.js        # Firebase (future)
│   │   └── analyticsService.js       # Analytics (future)
│   │
│   ├── 📂 utils/                     # Helper Functions
│   │   ├── helpers.js                # Calculations & formatting
│   │   ├── validation.js             # Input validation
│   │   └── dateUtils.js              # Date operations
│   │
│   └── 📂 constants/                 # App Configuration
│       └── index.js                  # Colors, quotes, data
│
├── 📂 assets/                        # Images & Icons
│   ├── images/
│   └── fonts/
│
├── 📄 package.json                   # Dependencies & scripts
├── 📄 app.json                       # Expo configuration
├── 📄 tsconfig.json                  # TypeScript configuration
│
├── 📚 Documentation Files
│   ├── README.md                     # Original Expo README
│   ├── README_APP.md                 # Complete app documentation
│   ├── QUICKSTART.md                 # 5-minute setup guide
│   ├── FEATURES.md                   # Detailed feature docs
│   ├── DEVELOPER.md                  # Developer guide
│   └── PROJECT_SETUP.md              # This file
│
└── 🔧 Configuration Files
    ├── .gitignore                    # Git ignore rules
    ├── .env                          # Environment variables (create)
    └── .eslintrc                     # Linting rules
```

## 🔑 Key Files Explained

### Core Application
| File | Purpose |
|------|---------|
| `App.js` | App entry point with HabitProvider |
| `app/_layout.tsx` | Tab navigation configuration |
| `src/context/HabitContext.js` | Global state management |
| `src/constants/index.js` | All app configuration data |

### Main Screens
| Screen | File | Purpose |
|--------|------|---------|
| Dashboard | `src/screens/DashboardScreen.js` | Overview & streaks |
| Track | `src/screens/DailyTrackerScreen.js` | Log daily habits |
| Urge SOS | `src/screens/UrgeControlScreen.js` | Emergency support |
| Tasks | `src/screens/TasksScreen.js` | Daily task list |
| Analytics | `src/screens/AnalyticsScreen.js` | Progress visualization |
| Settings | `src/screens/SettingsScreen.js` | App preferences |

### Utilities & Services
| File | Purpose |
|------|---------|
| `src/utils/helpers.js` | Streak calc, date formatting, etc. |
| `src/services/notificationService.js` | Notification scheduling & handling |

## 🚀 Running the Application

### Development Mode
```bash
# Start with hot reload
npm start

# For Android only
npm run android

# For iOS only
npm run ios

# Web version
npm run web
```

### Building for Production

#### With Expo EAS (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Initialize EAS
eas init

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

#### Local Build (Alternative)
```bash
# Navigate to project
cd "Habit change/habit-tracker"

# iOS (requires Mac)
npx react-native run-ios

# Android
npx react-native run-android
```

## 📊 Data Structure

### Daily Logging Format
```javascript
{
  "2024-01-15": {
    smoking: 5,           // Integer (0-50)
    masturbation: 0,      // Binary (0 or 1)
    workout: 1,           // Binary (0 or 1)
    sleep: 7.5            // Float (4-12)
  },
  "2024-01-16": {
    // ... next day's data
  }
}
```

### Habit Configuration
```javascript
{
  smoking: {
    name: "Smoking",
    target: 0,            // Daily target
    color: "#FF6B6B",     // Display color
    streak: 5             // Current streak
  }
  // ... other habits
}
```

### Achievement Format
```javascript
{
  id: "3-day",
  name: "3-Day Champion",
  emoji: "🥉",
  unlockedAt: "2024-01-12"
}
```

## 🔄 State Flow

```
User Action (e.g., log habit)
         ↓
Component calls useHabit()
         ↓
Dispatch action to HabitContext
         ↓
Reducer updates state
         ↓
useEffect triggers AsyncStorage save
         ↓
Component re-renders with new data
         ↓
User sees update
```

## 🔔 Notification System

### Scheduled Times
- **6:00 AM** - Morning motivation
- **6:00 PM** - Evening warning
- **10:00 PM** - Night sleep reminder

### Configuration
Edit in `src/constants/index.js`:
```javascript
export const NOTIFICATION_TIMES = {
  morning: '06:00',
  evening: '18:00',
  night: '22:00',
};
```

## 🎨 Styling Approach

### Dark Theme
- Primary Color: `#667EEA` (Purple)
- Dark Background: `#1A202C` (Near black)
- Card Background: `#2D3748` (Dark gray)
- Text Color: White & Gray shades
- Accent Colors: Per-habit specific

### Habit Colors
```javascript
smoking: '#FF6B6B'        // Red
masturbation: '#4ECDC4'   // Teal
workout: '#45B7D1'        // Blue
sleep: '#96CEB4'          // Green
```

## 💾 Data Persistence

### AsyncStorage
- Automatically saves state
- Survives app restart
- Debounced for performance
- Restored on app startup

### Backup Strategy
- Export data (future feature)
- Cloud sync with Firebase (future)
- Manual backup (user responsibility)

## 🔐 Security & Privacy

- ✅ No user authentication required
- ✅ Data stored locally only
- ✅ No external servers
- ✅ No tracking or analytics
- ✅ Complete privacy

## 🧪 Testing Checklist

### Functional Testing
- [ ] Log data for each habit type
- [ ] Complete tasks
- [ ] Test Urge SOS timer (5 min countdown)
- [ ] Check streak calculations
- [ ] View analytics with real data
- [ ] Toggle notifications
- [ ] Export data
- [ ] Clear data and restart

### Platform Testing
- [ ] Android phone
- [ ] iOS phone/simulator
- [ ] Web browser
- [ ] Different screen sizes
- [ ] Dark & light modes

### Performance Testing
- [ ] App loads in < 2 seconds
- [ ] Scrolling is smooth
- [ ] Charts render quickly
- [ ] No memory leaks

## 🐛 Common Issues & Solutions

### Issue: App Won't Start
**Solution:**
```bash
# Clear cache and reinstall
expo start --clear
rm -rf node_modules
npm install
```

### Issue: Notifications Not Working
**Solution:**
1. Check OS notification settings
2. Enable in app Settings
3. Verify notification times
4. Check device time is correct

### Issue: Data Not Saving
**Solution:**
1. Uninstall and reinstall app
2. Check storage permissions
3. Restart device
4. Check AsyncStorage working

### Issue: Charts Not Rendering
**Solution:**
1. Ensure data exists for selected date range
2. Check Chart Kit dependencies installed
3. Verify data format is correct

## 🔧 Environment Setup

### Create `.env` file
```env
EXPO_PUBLIC_NOTIFICATION_ENABLED=true
EXPO_PUBLIC_ANALYTICS_ENABLED=false
EXPO_PUBLIC_DEBUG_MODE=false
```

### Access in Code
```javascript
const notificationsEnabled = process.env.EXPO_PUBLIC_NOTIFICATION_ENABLED;
```

## 📦 Dependency Management

### Core Dependencies
```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "~54.0.33",
  "expo-router": "~6.0.23"
}
```

### UI/UX Libraries
```json
{
  "react-native-chart-kit": "^6.12.0",
  "react-native-progress": "^5.0.1",
  "react-native-svg": "^14.1.0"
}
```

### Utilities
```json
{
  "date-fns": "^3.0.0",
  "@react-native-community/async-storage": "^1.12.1",
  "uuid": "^9.0.1"
}
```

## 🚀 Deployment Checklist

Before deploying to app stores:

- [ ] Version number updated in `app.json`
- [ ] App name and description correct
- [ ] Icons and splash screens ready
- [ ] Privacy policy written
- [ ] Terms of service ready
- [ ] All features tested
- [ ] Notifications working
- [ ] Data persistence tested
- [ ] Performance optimized
- [ ] No console errors/warnings

## 📚 Documentation Files

For detailed information, refer to:

1. **README_APP.md** - Full app documentation
2. **QUICKSTART.md** - 5-minute setup for users
3. **FEATURES.md** - Detailed feature documentation
4. **DEVELOPER.md** - Developer customization guide
5. **This file** - Project structure & setup

## 🔗 Useful Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native API](https://reactnative.dev/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [Expo Notifications](https://docs.expo.dev/modules/expo-notifications/)
- [Firebase Docs](https://firebase.google.com/docs) (for future integration)

## 📞 Support & Help

**For users:** Check QUICKSTART.md and FEATURES.md
**For developers:** Check DEVELOPER.md and inline code comments
**For issues:** Review troubleshooting section above

## ✅ Post-Setup Verification

After installation, verify everything works:

```javascript
// Test 1: Open Dashboard - should see empty streaks
// Test 2: Add data in Tracker - should update state
// Test 3: Complete a task - should earn points
// Test 4: Click Urge SOS - should start 5-min timer
// Test 5: Check Analytics - should show basic charts
// Test 6: Go to Settings - should see options
```

---

**Next Steps:**
1. Read QUICKSTART.md for first-time usage
2. Run `npm start` to launch the app
3. Check FEATURES.md for detailed guides
4. Refer to DEVELOPER.md for customization

**Happy Habit Tracking!** 💪
