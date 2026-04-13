# Habit Tracker - Production Guide

## 🚀 Quick Start

### Local Development (Hot Reload on Mobile)

1. **Start Development Server**
   ```bash
   npm start
   ```

2. **Mobile Testing with Expo Go (Automatic Updates)**
   - Install [Expo Go](https://expo.dev/tools/expo-go) on your Android device
   - Scan the QR code displayed in terminal
   - Changes auto-sync instantly to your phone!

3. **Web Testing**
   ```bash
   npm start
   # Then press 'w' in terminal
   ```

## 📱 Architecture

### State Management
- **HabitContext.js**: Global state using React Context + useReducer
- **AsyncStorage**: Persistent local data storage
- **Features**: Habits, tasks, custom tasks, analytics, streaks

### Navigation
- **Expo Router**: File-based routing (app/ directory)
- **Bottom Tab Navigation**: Dashboard, Track, Urge SOS, Tasks, Analytics, Settings

### Error Handling
- **ErrorBoundary Component**: Catches and displays errors on screen
- **Try-catch blocks**: Async operations protected
- **Console logging**: Detailed debug information

## ⚙️ Environment Setup

### Required
- Node.js 18+
- npm/yarn package manager
- Expo account (free): https://expo.dev

### Expo CLI
```bash
npm install -g expo-cli
# or use npx (comes with npm)
npx expo
```

## 🔄 Development Workflow

### Making Changes
1. Edit code in VS Code
2. Save file
3. Watch terminal for compilation
4. Hot reload happens automatically on mobile!

### Available Commands
```bash
npm start           # Start dev server with QR code
npm run android     # Build for Android Emulator
npm run ios         # Build for iOS Simulator
npm run web         # Run in web browser
npm run lint        # Run ESLint
```

### Hot Reload Tips
- **Press 'r'** in terminal to reload app manually
- **Press 'w'** to switch to web browser
- **Press 'j'** to open debugger
- Changes to app files auto-reload
- Changes to `node_modules` require full restart

## 📦 APK Build (Production)

### Via EAS (Recommended)
```bash
npx eas build --platform android --profile preview
```

### Requirements
- Expo account linked
- Android keystore configured (done automatically)
- Free plan allows ~1 build/month (upgrade for more)

### Download APK
1. Go to: https://expo.dev/accounts/maheshcreation/projects/habit-tracker/builds
2. Download APK when build completes
3. Install on Android device

## 🔒 Security & Optimization

### Current Setup
- ✅ AsyncStorage for secure local persistence
- ✅ Error boundaries preventing app crashes
- ✅ Dev console logging (disable in production)
- ✅ All Expo-managed packages (no incompatible 3rd-party)

### Before Play Store Upload
- [ ] Remove console.log statements (or use logger)
- [ ] Set `NODE_ENV=production` in build
- [ ] Minify bundle: `expo build` uses this automatically
- [ ] Test on real device thoroughly
- [ ] Generate privacy policy
- [ ] Set up analytics (optional)

## 📊 Features

### Implemented ✅
- Daily habit tracking (smoking, activities, workouts, sleep)
- Streak calculation and display
- Custom task creation
- Task points and rewards
- Urge control timer
- Analytics dashboard
- Settings screen
- Local data persistence

### Customization
Edit these files to modify:
- **Habits**: `src/context/HabitContext.js` (initialState)
- **Colors**: `app/_layout.tsx` (COLORS object)
- **Screens**: `app/*.tsx` files

## 🐛 Troubleshooting

### App Won't Start
1. Check for console errors in terminal
2. Look at ErrorBoundary onscreen message
3. Clear cache: `npm start -- --clear`
4. Reinstall dependencies: `rm -r node_modules && npm install`

### Hot Reload Not Working
- Make sure Expo Go is version 6.x+
- Restart dev server: `Ctrl+C` then `npm start`
- Disable VPN/firewall temporarily

### BuildFailed on EAS
- Check build logs: https://expo.dev/accounts/maheshcreation/projects/habit-tracker
- Common issues:
  - Out of free builds (wait for reset)
  - Invalid code syntax (fix locally first)
  - Package incompatibilities (avoid third-party native)

## 📚 Key Files

```
habit-tracker/
├── src/
│   ├── context/HabitContext.js    # Global state
│   ├── screens/                   # Screen components
│   ├── components/ErrorBoundary.js# Error handling
│   └── services/notificationService.js # Notifications (disabled)
├── app/
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Dashboard
│   ├── tracker.tsx               # Daily tracker
│   ├── tasks.tsx                 # Task management
│   └── (tabs)/                   # Tab screens
├── package.json                  # Dependencies
├── app.json                      # Expo config
└── eas.json                      # EAS build config
```

## 🔗 Useful Links

- Expo Docs: https://docs.expo.dev
- Expo Go App: https://expo.dev/tools/expo-go
- EAS Dashboard: https://expo.dev/accounts/maheshcreation
- React Native Docs: https://reactnative.dev

## 📝 Version Info

- React Native: 0.81.5
- Expo: 54.0.33
- React: 18.2.0
- Node: 18+
- Last Updated: April 2026
