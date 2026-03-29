import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HabitManagementComponent } from './components/habit-management/habit-management.component';
import { DailyTrackerComponent } from './components/daily-tracker/daily-tracker.component';
import { QuickLogComponent } from './components/quick-log/quick-log.component';
import { MonthlyReportComponent } from './components/monthly-report/monthly-report.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    HabitManagementComponent,
    DailyTrackerComponent,
    QuickLogComponent,
    MonthlyReportComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
