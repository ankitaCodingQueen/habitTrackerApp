import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'habitTrackerData';

  constructor() { }

  // Get all data from localStorage
  getData<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(`${this.STORAGE_KEY}_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  }

  // Save data to localStorage
  setData<T>(key: string, data: T): void {
    try {
      localStorage.setItem(`${this.STORAGE_KEY}_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  }

  // Remove specific data
  removeData(key: string): void {
    try {
      localStorage.removeItem(`${this.STORAGE_KEY}_${key}`);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  }

  // Clear all app data
  clearAllData(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
}
