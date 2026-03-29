// Habit Model
export interface Habit {
  id: string;
  name: string;
  description: string;
  color: string;
  createdDate: Date;
  completions: { [date: string]: boolean }; // Format: YYYY-MM-DD
}

// Monthly Statistics
export interface MonthlyStats {
  month: string; // YYYY-MM
  totalDays: number;
  completedDays: number;
  completionPercentage: number;
  currentStreak: number;
  longestStreak: number;
  consistency: number; // percentage
}

// Habit Report
export interface HabitReport {
  habitId: string;
  habitName: string;
  stats: MonthlyStats;
  dailyData: { [date: string]: boolean };
}
