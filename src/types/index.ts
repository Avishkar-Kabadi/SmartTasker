export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed' | 'archived';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type Category = 'Research' | 'Work' | 'Learning' | 'Health' | 'Personal' | 'General';

export interface Task {
  id: number;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  due_time: string | null;
  reminder_id: string | null;
  is_recurring: boolean;
  recurrence: Recurrence;
  tags: string[];
  created_at: string;
  completed_at: string | null;
  updated_at: string;
}

export interface ParsedTask {
  title: string;
  due_date: string | null;
  due_time: string | null;
  category: Category;
  priority: Priority;
  tags: string[];
  isRecurring: boolean;
  recurrence: Recurrence;
}

export interface InsightData {
  totalTasks: number;
  completedThisWeek: number;
  currentStreak: number;
  weeklyData: { day: string; count: number }[];
  categoryData: { category: string; count: number; color: string }[];
  hourlyData: number[];  // 24 values, index = hour
}

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceBorder: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryGlow: string;
  accent: string;
  accentLight: string;
  accentGlow: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  gradientStart: string;
  gradientEnd: string;
  tabBarBg: string;
  statusBar: 'dark' | 'light';
}
