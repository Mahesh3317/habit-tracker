# Self Control & Habit Tracker 🎯

A modern, feature-rich mobile app designed to help young adults break bad habits (smoking, masturbation addiction) and build positive routines through daily tracking, smart notifications, and gamified rewards.

## 🎯 Features

### 1. **Daily Habit Tracker**
- Track cigarette consumption (daily input)
- Track abstinence from masturbation (yes/no)
- Log sleep time (hours)
- Log workout completion
- Visual daily completion progress indicator

### 2. **Smart Notifications**
- 🌅 Morning motivation (6 AM) - Discipline and confidence quotes
- ⚠️ Evening warnings (6 PM) - Urge prevention tips
- 🌙 Night sleep reminders (10 PM)
- Custom notification scheduling and management

### 3. **Streak System**
- Real-time streak tracking for each habit
- No smoking streak counter
- Abstinence streak counter
- Workout streak counter
- Visual streak indicators with warning system

### 4. **Daily Motivation**
- Fresh motivational quotes daily
- Three categories: Discipline, Confidence, Self-Control
- Contextual motivation based on user actions

### 5. **Dashboard**
- Weekly & monthly progress charts
- Cigarette reduction visualization
- Streak growth tracking
- Total points earned
- Badge collection display

### 6. **Emergency Urge Control** ⚡
- One-tap "I Feel Urge" button
- 5-minute countdown timer to ride out the urge
- Motivational messages during countdown
- Alternative action suggestions:
  - Walk 5-20 minutes
  - Drink water
  - Do pushups
  - Meditate
  - Cold shower
  - Stretch
  - Listen to music
  - Call a friend

### 7. **Daily Tasks System**
- Predefined daily tasks:
  - Walk 20 minutes
  - Avoid porn
  - Reduce 1 cigarette
  - Eat breakfast
- Task completion tracking
- Reward points (10 points per task)
- Daily bonus for completing all tasks (40 points)

### 8. **Profile & Goals**
- User goal setting
- Cigarette reduction goals
- Age and weight tracking (optional)
- Personal streak milestones

### 9. **Reward & Achievement System**
- Points-based reward system:
  - 10 Points = 1 Task completion
  - 40 Points = Daily bonus (all tasks)
  - 280 Points = Weekly badge
- Achievement badges:
  - 🥉 3-Day Champion
  - 🥈 Weekly Warrior (7-day)
  - ⭐ 2-Week Titan (14-day)
  - 🏆 Month Master (30-day)
  - 👑 Century Club (100-day)
  - 📋 Task Master

### 10. **Analytics & Progress**
- Weekly view of habit trends
- Monthly progress charts
- Reduction percentage calculations
- Insight generation
- Data export functionality

## 📱 Tech Stack

- **Frontend:** React Native with Expo
- **State Management:** Context API with useReducer
- **Local Storage:** AsyncStorage
- **Notifications:** Expo Notifications
- **Charts:** React Native Chart Kit
- **Styling:** React Native StyleSheet (Dark theme)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Steps

1. **Navigate to the project:**
   ```bash
   cd "Habit change/habit-tracker"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Install Expo app on your mobile device:**
   - iOS: Download from App Store
   - Android: Download from Google Play Store

4. **Start the development server:**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on your device:**
   - Scan the QR code with your device's camera
   - Or use Expo Go app to scan

## 🚀 Running the App

### Development
```bash
npm start
```

### Android
```bash
npm run android
# or
expo start --android
```

### iOS
```bash
npm run ios
# or
expo start --ios
```

### Web
```bash
npm run web
# or
expo start --web
```

## 📁 Project Structure

```
habit-tracker/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Main navigation layout
│   ├── index.tsx                 # Dashboard screen
│   ├── tracker.tsx               # Daily tracker screen
│   ├── urge.tsx                  # Urge control screen
│   ├── tasks.tsx                 # Tasks screen
│   ├── analytics.tsx             # Analytics screen
│   └── settings.tsx              # Settings screen
│
├── src/
│   ├── components/               # Reusable UI components
│   ├── context/
│   │   └── HabitContext.js        # Global state management
│   ├── screens/                  # Screen implementations
│   │   ├── DashboardScreen.js
│   │   ├── DailyTrackerScreen.js
│   │   ├── UrgeControlScreen.js
│   │   ├── TasksScreen.js
│   │   ├── AnalyticsScreen.js
│   │   └── SettingsScreen.js
│   ├── services/
│   │   └── notificationService.js # Notification handling
│   ├── utils/
│   │   └── helpers.js             # Utility functions
│   └── constants/
│       └── index.js               # App constants & quotes
│
├── assets/                        # Images and icons
├── package.json
├── app.json                       # Expo configuration
└── README.md
```

## 🎨 Design Principles

- **Dark Theme:** Easy on the eyes, modern aesthetic
- **Minimal UI:** Focus on core features
- **One-Hand Use:** All important actions reachable with one hand
- **Visual Feedback:** Clear indicators for completion and progress
- **Smooth Animations:** Engaging micro-interactions

## 💾 Data Structure

### Daily Data Format
```javascript
{
  "2024-01-15": {
    "smoking": 5,           // number of cigarettes
    "masturbation": 0,      // 0 or 1 (no or yes)
    "workout": 1,           // 0 or 1 (no or yes)
    "sleep": 7.5            // hours slept
  }
}
```

### Habits Format
```javascript
{
  "smoking": {
    name: "Smoking",
    target: 0,              // daily target
    color: "#FF6B6B",
    streak: 5
  }
  // ... other habits
}
```

## 🔔 Notification Configuration

Notifications are automatically scheduled when the app starts:

- **Morning (6:00 AM):** Random discipline/confidence quote
- **Evening (6:00 PM):** Urge prevention tips with alternatives
- **Night (10:00 PM):** Sleep quality reminder

Users can enable/disable each notification type in Settings.

## ⚙️ Configuration

### Modify Motivational Quotes
Edit `src/constants/index.js` to customize quotes:

```javascript
export const MOTIVATIONAL_QUOTES = {
  discipline: [
    'Your custom quote here...',
    // Add more quotes
  ],
  // ... other categories
};
```

### Adjust Daily Tasks
Modify `src/context/HabitContext.js` initial state:

```javascript
tasks: [
  { id: '1', name: 'Your Task', completed: false, points: 10 },
  // Add more tasks
];
```

### Change Notification Times
Edit `src/constants/index.js`:

```javascript
export const NOTIFICATION_TIMES = {
  morning: '06:00',      // Change here
  evening: '18:00',
  night: '22:00',
};
```

## 🐛 Troubleshooting

### App Won't Start
1. Clear cache: `expo start --clear`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check Node version: `node -v` (should be v18+)

### Notifications Not Working
1. Verify notification permissions are granted
2. Check `Settings > Notifications` in-app
3. Ensure notifications are enabled in OS settings

### Data Not Saving
1. Clear app cache and data
2. Reinstall the app
3. Check storage permissions

## 📊 Usage Tips

1. **Log Consistently:** Log data at the same time each day
2. **Use Urge SOS:** Click immediately when feeling triggered
3. **Complete Tasks:** Aim for 100% daily task completion
4. **Monitor Streaks:** Check analytics to see patterns
5. **Celebrate Wins:** Acknowledge badges and milestones
6. **Enable Notifications:** Maximum benefit with reminders active

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for personal use

## ❤️ Support

If this app helps you on your journey to better habits, please share it with others who might benefit. You are not alone in this struggle!

## 🔮 Future Features

- Firebase integration for cloud sync
- Social features (friend challenges)
- Advanced analytics with ML predictions
- Voice reminder options
- Community support forum
- Integration with health apps

---

**Remember:** Every day is a new opportunity to choose yourself. You've got this! 💪

For more information or support, visit the in-app documentation or settings.
