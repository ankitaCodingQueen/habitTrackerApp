import { Injectable } from '@angular/core';
import { Habit, MonthlyStats, HabitReport } from '../models/habit.model';
import { HabitService } from './habit.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private habitService: HabitService) { }

  // Get monthly statistics for a habit
  getMonthlyStats(habitId: string, year: number, month: number): MonthlyStats {
    const habit = this.habitService.getHabitById(habitId);

    if (!habit) {
      return this.getEmptyStats();
    }

    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const daysInMonth = new Date(year, month, 0).getDate();

    let completedDays = 0;
    const dailyData: { [date: string]: boolean } = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isCompleted = habit.completions[date] === true;
      dailyData[date] = isCompleted;
      if (isCompleted) {
        completedDays++;
      }
    }

    const completionPercentage = Math.round((completedDays / daysInMonth) * 100);
    const currentStreak = this.calculateCurrentStreak(dailyData, daysInMonth);
    const longestStreak = this.calculateLongestStreak(dailyData, daysInMonth);

    return {
      month: monthStr,
      totalDays: daysInMonth,
      completedDays,
      completionPercentage,
      currentStreak,
      longestStreak,
      consistency: completionPercentage
    };
  }

  // Get report for specific habit for current month
  getHabitReport(habitId: string): HabitReport {
    const habit = this.habitService.getHabitById(habitId);

    if (!habit) {
      return {
        habitId,
        habitName: '',
        stats: this.getEmptyStats(),
        dailyData: {}
      };
    }

    const now = new Date();
    const stats = this.getMonthlyStats(habitId, now.getFullYear(), now.getMonth() + 1);

    return {
      habitId,
      habitName: habit.name,
      stats,
      dailyData: this.getDailyDataForMonth(habitId, now.getFullYear(), now.getMonth() + 1)
    };
  }

  // Get all habits report for current month
  getAllHabitsReport(): HabitReport[] {
    const habits = this.habitService.getHabits();
    return habits.map(h => this.getHabitReport(h.id));
  }

  // Get daily data for a specific month
  private getDailyDataForMonth(habitId: string, year: number, month: number): { [date: string]: boolean } {
    const habit = this.habitService.getHabitById(habitId);

    if (!habit) {
      return {};
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyData: { [date: string]: boolean } = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyData[date] = habit.completions[date] === true;
    }

    return dailyData;
  }

  // Calculate current streak (consecutive completed days from today backwards)
  private calculateCurrentStreak(dailyData: { [date: string]: boolean }, daysInMonth: number): number {
    let streak = 0;

    for (let day = daysInMonth; day >= 1; day--) {
      const date = Object.keys(dailyData).find(d => d.endsWith(`-${String(day).padStart(2, '0')}`));
      if (date && dailyData[date]) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Calculate longest streak in the month
  private calculateLongestStreak(dailyData: { [date: string]: boolean }, daysInMonth: number): number {
    let longestStreak = 0;
    let currentStreak = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = Object.keys(dailyData).find(d => d.endsWith(`-${String(day).padStart(2, '0')}`));
      if (date && dailyData[date]) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return longestStreak;
  }

  // Empty stats template
  private getEmptyStats(): MonthlyStats {
    return {
      month: '',
      totalDays: 0,
      completedDays: 0,
      completionPercentage: 0,
      currentStreak: 0,
      longestStreak: 0,
      consistency: 0
    };
  }
}
