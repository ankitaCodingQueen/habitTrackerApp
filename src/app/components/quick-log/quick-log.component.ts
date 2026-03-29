import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit } from '../../models/habit.model';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-quick-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-log.component.html',
  styleUrls: ['./quick-log.component.css']
})
export class QuickLogComponent implements OnInit {
  habits: Habit[] = [];
  currentDate = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  daysInMonth: number = 0;
  dayLabels: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private habitService: HabitService) { }

  ngOnInit(): void {
    this.habitService.habits$.subscribe(habits => {
      this.habits = habits;
    });
    this.updateMonth();
  }

  updateMonth(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.currentYear = year;
    this.currentMonth = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    this.daysInMonth = new Date(year, month + 1, 0).getDate();
  }

  previousMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.updateMonth();
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.updateMonth();
  }

  goToToday(): void {
    this.currentDate = new Date();
    this.updateMonth();
  }

  isCurrentMonth(): boolean {
    const today = new Date();
    return this.currentDate.getFullYear() === today.getFullYear() &&
           this.currentDate.getMonth() === today.getMonth();
  }

  getDateString(day: number): string {
    return `${this.currentYear}-${String(this.currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  isCompleted(habitId: string, day: number): boolean {
    const dateStr = this.getDateString(day);
    return this.habitService.isHabitCompleted(habitId, dateStr);
  }

  toggleCompletion(habitId: string, day: number): void {
    const dateStr = this.getDateString(day);
    this.habitService.toggleHabitCompletion(habitId, dateStr);
  }

  getCompletedCount(habitId: string): number {
    let count = 0;
    for (let day = 1; day <= this.daysInMonth; day++) {
      if (this.isCompleted(habitId, day)) {
        count++;
      }
    }
    return count;
  }

  getCompletionPercentage(habitId: string): number {
    return this.daysInMonth > 0 ? Math.round((this.getCompletedCount(habitId) / this.daysInMonth) * 100) : 0;
  }

  // Generate day cells for a habit's calendar
  getDayRow(startDay: number, endDay: number): (number | null)[] {
    const row: (number | null)[] = [];
    for (let i = startDay; i <= endDay; i++) {
      row.push(i <= this.daysInMonth ? i : null);
    }
    return row;
  }

  // Get all calendar weeks with proper alignment
  getCalendarWeeks(): (number | null)[][] {
    const weeks: (number | null)[][] = [];
    const firstDay = new Date(this.currentYear, this.currentDate.getMonth(), 1).getDay();
    
    let week: (number | null)[] = Array(firstDay).fill(null);
    let day = 1;

    while (day <= this.daysInMonth) {
      for (let i = week.length; i < 7 && day <= this.daysInMonth; i++) {
        week.push(day);
        day++;
      }
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return weeks;
  }

  // Get week display for a habit (flattened)
  getHabitWeeks(habitId: string): { weeks: (number | null)[][], completed: Map<number, boolean> } {
    const weeks = this.getCalendarWeeks();
    const completed = new Map<number, boolean>();
    
    weeks.forEach(week => {
      week.forEach(day => {
        if (day) {
          completed.set(day, this.isCompleted(habitId, day));
        }
      });
    });

    return { weeks, completed };
  }
}
