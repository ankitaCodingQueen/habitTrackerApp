import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Habit } from '../../models/habit.model';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-habit-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habit-management.component.html',
  styleUrls: ['./habit-management.component.css']
})
export class HabitManagementComponent implements OnInit {
  habits: Habit[] = [];
  showForm = false;
  isEditing = false;
  editingHabitId: string | null = null;

  // Form fields
  habitName = '';
  habitDescription = '';

  constructor(private habitService: HabitService) { }

  ngOnInit(): void {
    this.habitService.habits$.subscribe(habits => {
      this.habits = habits;
    });
  }

  // Toggle form visibility
  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  // Add new habit
  addHabit(): void {
    if (this.habitName.trim()) {
      this.habitService.createHabit(this.habitName, this.habitDescription);
      this.resetForm();
      this.showForm = false;
    }
  }

  // Edit habit
  editHabit(habit: Habit): void {
    this.isEditing = true;
    this.editingHabitId = habit.id;
    this.habitName = habit.name;
    this.habitDescription = habit.description;
    this.showForm = true;
  }

  // Save edited habit
  saveEditedHabit(): void {
    if (this.editingHabitId && this.habitName.trim()) {
      this.habitService.updateHabit(this.editingHabitId, {
        name: this.habitName,
        description: this.habitDescription
      });
      this.resetForm();
      this.showForm = false;
    }
  }

  // Delete habit
  deleteHabit(id: string): void {
    if (confirm('Are you sure you want to delete this habit?')) {
      this.habitService.deleteHabit(id);
    }
  }

  // Reset form
  private resetForm(): void {
    this.habitName = '';
    this.habitDescription = '';
    this.isEditing = false;
    this.editingHabitId = null;
  }

  // Cancel editing
  cancelEdit(): void {
    this.resetForm();
    this.showForm = false;
  }
}
