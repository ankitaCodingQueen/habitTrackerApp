import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Habit } from '../models/habit.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class HabitService {
  private habitsSubject = new BehaviorSubject<Habit[]>([]);
  public habits$ = this.habitsSubject.asObservable();

  private readonly HABITS_KEY = 'habits';
  private readonly COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

  constructor(private storageService: StorageService) {
    this.loadHabits();
  }

  // Load habits from localStorage
  private loadHabits(): void {
    const habits = this.storageService.getData<Habit[]>(this.HABITS_KEY) || [];
    this.habitsSubject.next(habits);
  }

  // Get all habits
  getHabits(): Habit[] {
    return this.habitsSubject.value;
  }

  // Get single habit by ID
  getHabitById(id: string): Habit | undefined {
    return this.habitsSubject.value.find(h => h.id === id);
  }

  // Create new habit
  createHabit(name: string, description: string): Habit {
    const habit: Habit = {
      id: this.generateId(),
      name,
      description,
      color: this.selectRandomColor(),
      createdDate: new Date(),
      completions: {}
    };

    const habits = [...this.habitsSubject.value, habit];
    this.habitsSubject.next(habits);
    this.storageService.setData(this.HABITS_KEY, habits);

    return habit;
  }

  // Update habit
  updateHabit(id: string, updates: Partial<Omit<Habit, 'id' | 'createdDate' | 'completions'>>): void {
    const habits = this.habitsSubject.value.map(h =>
      h.id === id ? { ...h, ...updates } : h
    );

    this.habitsSubject.next(habits);
    this.storageService.setData(this.HABITS_KEY, habits);
  }

  // Delete habit
  deleteHabit(id: string): void {
    const habits = this.habitsSubject.value.filter(h => h.id !== id);
    this.habitsSubject.next(habits);
    this.storageService.setData(this.HABITS_KEY, habits);
  }

  // Mark habit as completed for a specific date
  toggleHabitCompletion(habitId: string, date: string): void {
    const habits = this.habitsSubject.value.map(h => {
      if (h.id === habitId) {
        const completions = { ...h.completions };
        completions[date] = !completions[date];
        return { ...h, completions };
      }
      return h;
    });

    this.habitsSubject.next(habits);
    this.storageService.setData(this.HABITS_KEY, habits);
  }

  // Check if habit is completed on specific date
  isHabitCompleted(habitId: string, date: string): boolean {
    const habit = this.getHabitById(habitId);
    return habit ? habit.completions[date] === true : false;
  }

  // Helper methods
  private generateId(): string {
    return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private selectRandomColor(): string {
    return this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
  }
}
