import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Habit, HabitReport } from '../../models/habit.model';
import { HabitService } from '../../services/habit.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-monthly-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit {
  habits: Habit[] = [];
  reports: HabitReport[] = [];
  selectedHabitId: string | null = null;
  selectedReport: HabitReport | null = null;

  constructor(
    private habitService: HabitService,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.habitService.habits$.subscribe(habits => {
      this.habits = habits;
      this.updateReports();
      if (habits.length > 0 && !this.selectedHabitId) {
        this.selectedHabitId = habits[0].id;
        this.selectHabit(habits[0].id);
      }
    });
  }

  // Update all reports
  private updateReports(): void {
    this.reports = this.reportService.getAllHabitsReport();
  }

  // Select habit and show its report
  selectHabit(habitId: string): void {
    this.selectedHabitId = habitId;
    const report = this.reports.find(r => r.habitId === habitId);
    this.selectedReport = report || null;
  }

  // Get progress bar width percentage
  getProgressWidth(completedDays: number, totalDays: number): number {
    return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  }

  // Get status label based on percentage
  getStatusLabel(percentage: number): string {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 70) return 'Good';
    if (percentage >= 50) return 'Fair';
    if (percentage >= 20) return 'Needs Work';
    return 'Just Started';
  }

  // Get status color
  getStatusColor(percentage: number): string {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 70) return '#17a2b8';
    if (percentage >= 50) return '#ffc107';
    if (percentage >= 20) return '#fd7e14';
    return '#dc3545';
  }

  // Calculate weekly average from daily data
  getWeeklyBreakdown(): { week: number; completed: number; total: number; percentage: number }[] {
    if (!this.selectedReport) return [];

    const dailyData = this.selectedReport.stats;
    const weeks: { week: number; completed: number; total: number; percentage: number }[] = [];
    const month = parseInt(dailyData.month.split('-')[1]);
    const year = parseInt(dailyData.month.split('-')[0]);

    const daysInMonth = new Date(year, month, 0).getDate();
    let weekNum = 1;
    let weekCompleted = 0;
    let weekTotal = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      if (day > 1 && new Date(year, month - 1, day).getDay() === 0) {
        const weekPercentage = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
        weeks.push({ week: weekNum, completed: weekCompleted, total: weekTotal, percentage: weekPercentage });
        weekNum++;
        weekCompleted = 0;
        weekTotal = 0;
      }

      weekTotal++;
      if (this.selectedReport?.dailyData[dateStr]) {
        weekCompleted++;
      }
    }

    // Add last week
    if (weekTotal > 0) {
      const weekPercentage = Math.round((weekCompleted / weekTotal) * 100);
      weeks.push({ week: weekNum, completed: weekCompleted, total: weekTotal, percentage: weekPercentage });
    }

    return weeks;
  }
}
