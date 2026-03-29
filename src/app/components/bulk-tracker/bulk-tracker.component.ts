import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit } from '../../models/habit.model';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-bulk-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-tracker.component.html',
  styleUrls: ['./bulk-tracker.component.css']
})
export class BulkTrackerComponent implements OnInit {
  habits: Habit[] = [];
  currentDate = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  daysInMonth: number = 0;
  dayLabels: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: (number | null)[] = [];

  constructor(private habitService: HabitService) { }

  ngOnInit(): void {
    this.habitService.habits$.subscribe(habits => {
      this.habits = habits;
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
  isCompleted(habitId: string, day: number): boolean {
    const dateStr = this.getDateString(day);
    return this.habitService.isHabitCompleted(habitId, dateStr);
  }

  // Toggle habit completion on a specific day
  toggleCompletion(habitId: string, day: number): void {
    const dateStr = this.getDateString(day);
    this.habitService.toggleHabitCompletion(habitId, dateStr);
  }

  // Get completion percentage for habit in current month
  getHabitCompletionPercentage(habitId: string): number {
    let completed = 0;
    for (let day = 1; day <= this.daysInMonth; day++) {
      if (this.isCompleted(habitId, day)) {
        completed++;
      }
    }
    return this.daysInMonth > 0 ? Math.round((completed / this.daysInMonth) * 100) : 0;
  }

  // Get completed days count for habit in current month
  getHabitCompletedDays(habitId: string): number {
    let completed = 0;
    for (let day = 1; day <= this.daysInMonth; day++) {
      if (this.isCompleted(habitId, day)) {
        completed++;
      }
    }
    return completed;
  }
}
