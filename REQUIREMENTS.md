# Product Requirements Document (PRD)
# Self Control & Habit Tracker - Feature Enhancement

## Executive Summary
Enhancement of the existing Self Control & Habit Tracker app with terminology updates, custom to-do list/routine management, and advanced task analytics capabilities.

---

## 1. TERMINOLOGY UPDATE

### Objective
Replace sensitive references with neutral professional language for broader appeal and user comfort.

### Changes Required

#### 1.1 Terminology Mapping
| Old Term | New Term | Usage |
|----------|----------|-------|
| "Avoid Masturbation" | "Private Activity" | Habit tracking, dashboard, analytics |
| Masturbation Streak | Private Activity Streak | Streak display, metrics |
| Masturbation Frequency | Private Activity Frequency | Analytics labels |
| (Associated colors) | Teal (#4ECDC4) | Keep existing color scheme |

#### 1.2 Affected Components
- [x] DashboardScreen.js
- [x] DailyTrackerScreen.js
- [x] AnalyticsScreen.js
- [x] UrgeControlScreen.js
- [x] TasksScreen.js
- [x] SettingsScreen.js
- [x] HabitContext.js (state variable names)
- [x] helpers.js (calculation functions)
- [x] constants/index.js
- [x] Documentation files (FEATURES.md, README_APP.md, etc.)

#### 1.3 Implementation Notes
- Internal state uses consistent naming: `privateActivity` (camelCase)
- Display labels use: "Private Activity" (user-facing)
- Color coding remains consistent
- Backward compatibility: Handle existing data stored with old keys

---

## 2. CUSTOM TO-DO LIST & ROUTINE FEATURE

### Objective
Enable users to create and manage their own custom daily/weekly tasks beyond the default 4 tasks.

### 2.1 Data Model

#### CustomTask Schema
```javascript
{
  id: string (UUID),
  name: string (max 50 chars),
  description: string (optional, max 200 chars),
  repeatType: 'daily' | 'weekly',
  reminderEnabled: boolean,
  reminderTime: string (HH:MM format, e.g., "14:30"),
  pointsReward: number (5-100, default 10),
  createdAt: timestamp,
  completedDates: [timestamp], // Track all completions
  isActive: boolean (default true)
}
```

#### CompletionLog Schema
```javascript
{
  taskId: string,
  dateCompleted: date (YYYY-MM-DD),
  completedAt: timestamp,
  dayOfWeek: number (0-6 for weekly tasks)
}
```

### 2.2 Features

#### Task Creation
- **Input Fields:**
  - Task name (required, validated)
  - Optional description
  - Repeat type selector (Daily / Weekly)
  - Reminder toggle + time picker (if enabled)
  - Points reward slider (5-100)
- **Validation:**
  - Name not empty (1-50 chars)
  - No duplicate active tasks
  - Valid time format
- **Submission:**
  - Generate unique UUID
  - Store in local storage
  - Show success toast
  - Redirect to task list

#### Task List Management
- **Display:**
  - All active custom tasks
  - Grouped by repeat type (Daily / Weekly)
  - Show next occurrence
  - Show completion status for today
  - Points reward badge
- **Actions per task:**
  - Edit (name, description, points, reminder)
  - Toggle active/inactive
  - Delete (with confirmation)
  - View history (last 10 completions)
- **Sorting:**
  - Today's incomplete tasks first
  - Then by creation date

#### Task Completion
- **Checkbox in Daily View:**
  - Tap to mark complete for today
  - For weekly: appears only on designated day
  - Visual feedback (strikethrough + check)
  - Add timestamp when marked complete
- **Auto-reset:**
  - Daily tasks: Reset at midnight (00:00)
  - Weekly tasks: Reset on designated day at midnight
  - Completion status cleared, but logged in history

### 2.3 Default Tasks
- Keep existing 4 built-in tasks (Walk, Avoid Porn, Reduce Cigarette, Eat Breakfast)
- Built-in tasks always appear
- Custom tasks appear below built-ins
- Can disable (not delete) built-in tasks

### 2.4 Reminders (Phase 1)
- Schedule local notifications
- Use Expo Notifications API
- Time picker in settings for custom reminder times
- Default: 9 AM if not specified
- Can be toggled per task

---

## 3. TASK ANALYTICS

### Objective
Provide detailed insights into task completion patterns and performance.

### 3.1 Analytics Metrics

#### Per-Task Metrics
```javascript
{
  taskId: string,
  taskName: string,
  completionPercentage: number (0-100, last 7 days),
  currentStreak: number,
  bestStreak: number,
  totalCompletes: number,
  lastCompleted: date,
  averageDaily: number (completions per day),
  insight: string (generated)
}
```

#### Collection-Level Analytics
```javascript
{
  overallCompletion: number (avg % for all tasks),
  mostConsistentTask: { name, percentage },
  leastPerformingTask: { name, percentage },
  tasksAtRisk: [{ name, percentage }] // <50%
  weekOfInsight: string
}
```

### 3.2 Display Components

#### Task Analytics Card (Individual)
- Task name + icon
- **Metrics displayed:**
  - Current streak (with badge)
  - Best streak achieved
  - Completion % (last 7 days) - circular progress
  - Simple bar chart (7 days visual)
  - Points per completion
- **Smart Insight below chart:**
  - "Completing 80% of the time" 
  - "2-day streak - keep going!"
  - "You haven't completed this in 5 days"
  - "Your most consistent task"
  - "Consider completing this more often"

#### Summary Dashboard
- **Overall Stats:**
  - Total custom tasks created
  - Overall completion % (all tasks)
  - Most consistent task name + %
  - Least performing task name + %
- **Tasks at Risk (>0% but <50%):**
  - List with % for each
  - Suggestion: "Focus on these tasks"

### 3.3 Analytics Data Collection
- **Storage:** Persist completion logs in AsyncStorage
- **Calculation:** Real-time calculation from logs
- **Performance:** Lazy-load analytics (don't calculate on every render)
- **Scope:** Last 7 days for % calculation, all-time for streaks

---

## 4. DASHBOARD INTEGRATION

### Objective
Display task progress at a glance on the main dashboard.

### 4.1 New Dashboard Section

#### "Today's Routine" Card
- **Position:** Below streaks, above badges
- **Display:**
  - Title: "Today's Routine"
  - Progress bar (X/Y tasks completed)
  - Example: "6/10 tasks completed"
  - Color: Green when >75% complete, Yellow >50%, Red <50%
- **Quick Stats:**
  - Built-in tasks: Y/4
  - Custom tasks: X/N (if any)
- **Call-to-Action:**
  - "View all tasks" button
  - Clicking navigates to daily tracker

#### Task Insight Widget
- **Position:** Below "Today's Routine" card
- **Displays:**
  - 📈 "Most Consistent: [Task Name] (85%)"
  - 🎯 "Focus On: [Task Name] (40%)"
  - 🔥 "Streak: XX days across all tasks"
- **Tappable:** Navigate to task analytics screen

### 4.2 Performance Indicators
- **Green Zone:** 75-100% completion
- **Yellow Zone:** 50-74% completion
- **Red Zone:** 0-49% completion

---

## 5. DATA PERSISTENCE & MIGRATION

### 5.1 Storage Strategy
- **AsyncStorage keys:**
  - `@habittrackerapp/customTasks` - Array of custom task definitions
  - `@habittrackerapp/taskCompletions` - Completion logs
  - `@habittrackerapp/habitData` - Existing habit data (no change)
- **Schema versioning:** Add version field for future migrations

### 5.2 Backward Compatibility
- **Old device users:** Existing habit data loads unchanged
- **New tasks:** Custom task arrays default to empty
- **Terminology:** Existing habit keys remain, display layer translates to "Private Activity"

### 5.3 Data Export/Import (Future)
- Include custom tasks in CSV export
- Support reimport of task definitions
- Documented in DEVELOPER.md

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Context Updates
**HabitContext extends with:**
```javascript
// New state
customTasks: [],
taskCompletions: [],

// New actions
ADD_CUSTOM_TASK
UPDATE_CUSTOM_TASK
DELETE_CUSTOM_TASK
TOGGLE_CUSTOM_TASK_ACTIVE
COMPLETE_CUSTOM_TASK
RESET_DAILY_TASKS_BATCH
LOAD_TASK_COMPLETIONS

// New selectors (in hooks)
useCustomTasks()
useTaskAnalytics()
useTaskCompletion(taskId, date)
useOverallTaskMetrics()
```

### 6.2 New/Updated Components
- **TaskManagementScreen.tsx** - Create/edit/list custom tasks
- **TaskAnalyticsScreen.tsx** - Analytics for all tasks
- **Updated DashboardScreen.js** - Add task progress widgets
- **Updated DailyTrackerScreen.js** - Render custom tasks + built-ins
- **Updated HabitContext.js** - State + persistence logic

### 6.3 Utility Functions
```javascript
// src/utils/taskHelpers.js - NEW FILE
calculateTaskCompletion(taskId, days = 7)
getCurrentStreak(taskId)
getBestStreak(taskId)
generateTaskInsight(taskMetrics)
shouldTaskAppearToday(repeatType, createdAt)
resetDailyTasks(taskList)
```

### 6.4 Navigation Updates
- Add "TaskManagement" route
- Add "TaskAnalytics" route (accessible from dashboard + settings)
- Update tab navigation if needed

---

## 7. IMPLEMENTATION PHASES

### Phase 1: Core Infrastructure
1. Update terminology (terminology replacement)
2. Extend HabitContext for custom tasks
3. Create utility functions for task logic
4. Add task storage/persistence

### Phase 2: Task Management UI
1. Create TaskManagementScreen (add/edit/list)
2. Update DailyTrackerScreen to render custom tasks
3. Add task completion logic
4. Implement auto-reset at midnight

### Phase 3: Analytics & Insights
1. Create TaskAnalyticsScreen
2. Build analytics calculation engine
3. Generate smart insights
4. Create analytics components

### Phase 4: Dashboard & Integration
1. Update DashboardScreen with task progress
2. Add task insights widget
3. Update navigation
4. Full integration testing

### Phase 5: Polish & Documentation
1. Bug fixes and optimization
2. Update all documentation
3. Add to FEATURES.md
4. Create tutorial for new features

---

## 8. SUCCESS CRITERIA

### Functional Requirements
- [x] All terminology replaced successfully
- [x] Users can create custom daily/weekly tasks
- [x] Tasks display and update correctly in daily view
- [x] Tasks auto-reset at midnight
- [x] Completion data persists across sessions
- [x] Analytics calculated accurately
- [x] Dashboard shows task progress
- [x] No breaking changes to existing features

### Performance Requirements
- Page load time: <1s for task screens
- Analytics calculation: <500ms
- Transitions smooth (60fps on modern devices)

### User Experience
- Clear task creation wizard
- Intuitive task management
- Insightful analytics
- Seamless dashboard integration

---

## 9. FUTURE ENHANCEMENTS (Out of Scope)

1. **Task Templates:** Pre-made task packs (exercise, productivity, health)
2. **Habit Stacking:** Link custom tasks to existing habits
3. **Team/Family:** Share tasks with accountability partner
4. **AI Insights:** ML-based recommendations
5. **Advanced Analytics:** Export, charts, trends
6. **Time Blocking:** Schedule tasks by time of day
7. **Syncing:** Cloud backup of custom tasks
8. **Mobile Notifications:** Push notifications for task reminders

---

## 10. ESTIMATED EFFORT

| Phase | Effort | Status |
|-------|--------|--------|
| Phase 1 | 2 hours | Ready |
| Phase 2 | 3 hours | Ready |
| Phase 3 | 2.5 hours | Ready |
| Phase 4 | 1.5 hours | Ready |
| Phase 5 | 1 hour | Ready |
| **Total** | **~10 hours** | **Ready to Start** |

---

## Appendices

### A. Terminology Reference
All instances of "Masturbation" → "Private Activity"
All instances of "Porn" → Keep as is (used in context of pornography avoidance)

### B. Color Scheme
- Private Activity: Teal (#4ECDC4) - No change
- Tasks: Blue (#45B7D1) - New
- Analytics accent: Purple (#9B59B6) - New

### C. API Reference (If migrating to backend)
Not applicable for current scope (local-first architecture)

---

**Document Version:** 1.0  
**Last Updated:** April 10, 2026  
**Status:** Ready for Development
