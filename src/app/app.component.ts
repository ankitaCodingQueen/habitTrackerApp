import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitManagementComponent } from './components/habit-management/habit-management.component';
import { DailyTrackerComponent } from './components/daily-tracker/daily-tracker.component';
import { MonthlyReportComponent } from './components/monthly-report/monthly-report.component';
import { BulkTrackerComponent } from './components/bulk-tracker/bulk-tracker.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Habit Tracker';
  activeTab = 'habits';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
