export const MOTIVATIONAL_QUOTES = {
  discipline: [
    'Discipline is choosing what you want most over what you want now.',
    'The secret of discipline is motivation. When your motive is interesting enough, discipline takes care of itself.',
    'Discipline is freedom. It frees you to do the things you want to do.',
    'What you do today can improve all your tomorrows.',
    'Success is the sum of small efforts repeated day in and day out.',
    'You don\'t have to be great to start, but you have to start to be great.',
    'The difference between who you are and who you want to be is what you do.',
  ],
  confidence: [
    'You are braver than you believe, stronger than you seem, and smarter than you think.',
    'Believe in yourself. You are braver than you believe, stronger than you seem, and smarter than you think.',
    'The only way to do great work is to love what you do.',
    'You don\'t need to be perfect to be amazing.',
    'Your potential is endless. Your only limit is your mind.',
    'Confidence is not "they will like me". Confidence is "I´ll be fine either way".',
    'Be yourself; everyone else is already taken.',
  ],
  selfControl: [
    'Self-control is strength. Right thought is mastery. Calmness is power.',
    'The moment you feel most lost is when you can find yourself.',
    'Self-control means controlling your thoughts, your words, and your actions.',
    'Every time you choose to ignore the urge, you build your strength.',
    'Control your impulses, not your dreams.',
    'The ability to control your thoughts is the beginning of freedom.',
    'You are not your urges. You are stronger than them.',
  ],
};

export const ACHIEVEMENTS = [
  { id: '3-day', name: '3-Day Champion', description: 'Maintain a 3-day streak', icon: '🥉' },
  { id: '7-day', name: 'Weekly Warrior', description: 'Maintain a 7-day streak', icon: '🥈' },
  { id: '14-day', name: '2-Week Titan', description: 'Maintain a 14-day streak', icon: '⭐' },
  { id: '30-day', name: 'Month Master', description: 'Maintain a 30-day streak', icon: '🏆' },
  { id: '100-day', name: 'Century Club', description: 'Maintain a 100-day streak', icon: '👑' },
  { id: 'all-tasks', name: 'Task Master', description: 'Complete all daily tasks', icon: '📋' },
];

export const COLORS = {
  primary: '#667EEA',
  secondary: '#764BA2',
  success: '#48BB78',
  danger: '#F56565',
  warning: '#ED8936',
  info: '#4299E1',
  dark: '#1A202C',
  light: '#F7FAFC',
  accent: '#FF6B9D',
};

export const URGE_ALTERNATIVES = [
  { name: 'Take a walk', icon: '🚶', duration: '5-20 min' },
  { name: 'Drink water', icon: '💧', duration: '1 min' },
  { name: 'Do pushups', icon: '💪', duration: '5-10 min' },
  { name: 'Meditate', icon: '🧘', duration: '5-10 min' },
  { name: 'Cold shower', icon: '🚿', duration: '5 min' },
  { name: 'Stretch', icon: '🤸', duration: '5-10 min' },
  { name: 'Listen to music', icon: '🎵', duration: '5-10 min' },
  { name: 'Call a friend', icon: '📞', duration: '10-20 min' },
];

export const NOTIFICATION_TIMES = {
  morning: '06:00',
  evening: '18:00',
  night: '22:00',
};

export const HABIT_TARGETS = {
  smoking: { min: 0, max: 50, unit: 'cigarettes' },
  privateActivity: { min: 0, max: 1, unit: 'yes/no' },
  workout: { min: 0, max: 1, unit: 'yes/no' },
  sleep: { min: 4, max: 12, unit: 'hours' },
};

export const HABIT_DISPLAY_NAMES = {
  smoking: 'Smoking',
  privateActivity: 'Private Activity',
  workout: 'Workout',
  sleep: 'Sleep',
};
