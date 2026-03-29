import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit } from '../../models/habit.model';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-daily-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-tracker.component.html',
  styleUrls: ['./daily-tracker.component.css']
})
export class DailyTrackerComponent implements OnInit {
  habits: Habit[] = [];
  currentDate = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  daysInMonth: number = 0;
  dayLabels: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: (number | null)[] = [];
  selectedHabitId: string | null = null;
  Math = Math;

  constructor(private habitService: HabitService) { }

  ngOnInit(): void {
    this.habitService.habits$.subscribe(habits => {
      this.habits = habits;
      if (habits.length > 0 && !this.selectedHabitId) {
        this.selectedHabitId = habits[0].id;
      }
    });

    this.updateCalendar();
  }

  // Update calendar for current month
  updateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.currentYear = year;
    this.currentMonth = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });
    this.daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    this.calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push(null);
    }

    // Add days of month
    for (let day = 1; day <= this.daysInMonth; day++) {
      this.calendarDays.push(day);
    }
  }

  // Go to previous month
  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.updateCalendar();
  }

  // Go to next month
  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.updateCalendar();
  }

  // Go to today
  goToToday(): void {
    this.currentDate = new Date();
    this.updateCalendar();
  }

  isCurrentMonth(): boolean {
    const today = new Date();
    return this.currentDate.getFullYear() === today.getFullYear() &&
           this.currentDate.getMonth() === today.getMonth();
  }

  // Get date string in YYYY-MM-DD format
  getDateString(day: number): string {
    return `${this.currentYear}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  // Check if habit is completed on a specific day
  isCompleted(day: number): boolean {
    if (!this.selectedHabitId) return false;
    const dateStr = this.getDateString(day);
    return this.habitService.isHabitCompleted(this.selectedHabitId, dateStr);
  }

  // Toggle habit completion on a specific day
  toggleCompletion(day: number): void {
    if (!this.selectedHabitId) return;
    const dateStr = this.getDateString(day);
    this.habitService.toggleHabitCompletion(this.selectedHabitId, dateStr);
  }

  // Select a different habit
  selectHabit(habitId: string): void {
    this.selectedHabitId = habitId;
  }

  // Get selected habit
  getSelectedHabit(): Habit | undefined {
    return this.habits.find(h => h.id === this.selectedHabitId);
  }

  // Count completed days in current view
  getCompletedCount(): number {
    if (!this.selectedHabitId) return 0;
    let count = 0;
    for (let day = 1; day <= this.daysInMonth; day++) {
      if (this.isCompleted(day)) {
        count++;
      }
    }
    return count;
  }
}
