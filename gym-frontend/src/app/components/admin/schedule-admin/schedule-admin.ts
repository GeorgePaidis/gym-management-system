import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../shared/services/schedule.service';
import { ISchedule, IWorkoutClass } from '../../../shared/interfaces/schedule.interface';

type ScheduleDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

@Component({
  selector: 'app-schedule-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-admin.html',
  styleUrls: ['./schedule-admin.css']
})
export class ScheduleAdminComponent implements OnInit {
  scheduleService = inject(ScheduleService);
  private cdRef = inject(ChangeDetectorRef);
  
  schedule: ISchedule | null = null;
  loading = true;
  saving = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  days: ScheduleDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  selectedDay: ScheduleDay = 'monday';
  newClass: IWorkoutClass = { time: '', name: '' };
  
  editMode = false;
  editingIndex: number | null = null;

  ngOnInit() {
    this.loadSchedule();
  }

  loadSchedule() {
    this.loading = true;
    this.cdRef.detectChanges();
    
    this.scheduleService.getSchedule().subscribe({
      next: (schedule) => {
        this.schedule = schedule;
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.showError('Αποτυχία φόρτωσης προγράμματος. Παρακαλώ δοκιμάστε ξανά.');
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  getClassesForDay(day: ScheduleDay): IWorkoutClass[] {
    if (!this.schedule) return [];
    return this.schedule[day] || [];
  }

  getTotalClasses(): number {
    if (!this.schedule) return 0;
    
    return this.days.reduce((total, day) => {
      return total + this.getClassesForDay(day).length;
    }, 0);
  }

  validateTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  addClass() {
    if (!this.newClass.time || !this.newClass.name) {
      this.showError('Παρακαλώ συμπληρώστε και ώρα και όνομα προπόνησης');
      return;
    }

    if (!this.validateTimeFormat(this.newClass.time)) {
      this.showError('Παρακαλώ εισάγετε ώρα σε σωστή μορφή (π.χ. 09:00 ή 14:30)');
      return;
    }

    if (!this.schedule) {
      this.schedule = {
        _id: '',
        monday: [], tuesday: [], wednesday: [], thursday: [],
        friday: [], saturday: [], sunday: []
      };
    }

    if (!this.schedule[this.selectedDay]) {
      this.schedule[this.selectedDay] = [];
    }

    const dayClasses = this.schedule[this.selectedDay];

    if (this.editMode && this.editingIndex !== null) {
      dayClasses[this.editingIndex] = { ...this.newClass };
      
      dayClasses.sort((a, b) => a.time.localeCompare(b.time));
      
      this.showSuccess('Η προπόνηση ενημερώθηκε! Πατήστε Αποθήκευση για να ενημερωθεί το πρόγραμμα!!!');
      this.resetForm();
    } else {
      const existingTime = dayClasses.find(c => c.time === this.newClass.time);
      if (existingTime) {
        this.showError('Υπάρχει ήδη προπόνηση στην ίδια ώρα αυτήν την ημέρα');
        return;
      }
      
      dayClasses.push({ ...this.newClass });
      
      dayClasses.sort((a, b) => a.time.localeCompare(b.time));
      
      this.showSuccess('Η προπόνηση προστέθηκε! Πατήστε Αποθήκευση για να ενημερωθεί το πρόγραμμα!!!');
      this.resetForm();
    }

    this.schedule = { ...this.schedule };
    this.cdRef.detectChanges();
  }

  editClass(day: ScheduleDay, index: number) {
    const dayClasses = this.getClassesForDay(day);
    this.selectedDay = day;
    this.newClass = { ...dayClasses[index] };
    this.editMode = true;
    this.editingIndex = index;
    this.cdRef.detectChanges();
  }

  deleteClass(day: ScheduleDay, index: number) {
    if (!confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε αυτή την προπόνηση;')) return;
    
    if (!this.schedule) return;
    
    const dayClasses = this.schedule[day];
    if (dayClasses && index >= 0 && index < dayClasses.length) {
      dayClasses.splice(index, 1);
      this.schedule = { ...this.schedule };
      this.showSuccess('Η προπόνηση διαγράφηκε! Πατήστε Αποθήκευση για να ενημερωθεί το πρόγραμμα!!!.');
      this.cdRef.detectChanges();
    }
  }

  saveSchedule() {
    if (!this.schedule) {
      this.showError('Δεν υπάρχει πρόγραμμα για αποθήκευση');
      return;
    }
    
    this.saving = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdRef.detectChanges();
    
    this.scheduleService.updateSchedule(this.schedule).subscribe({
      next: (updatedSchedule) => {
        this.schedule = updatedSchedule;
        this.saving = false;
        this.showSuccess('Το πρόγραμμα αποθηκεύτηκε επιτυχώς!');
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.saving = false;
        this.showError('Αποτυχία αποθήκευσης προγράμματος. Παρακαλώ δοκιμάστε ξανά.');
        this.cdRef.detectChanges();
      }
    });
  }

  resetForm() {
    this.newClass = { time: '', name: '' };
    this.editMode = false;
    this.editingIndex = null;
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
      this.cdRef.detectChanges();
    }, 3000);
  }

  private showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
      this.cdRef.detectChanges();
    }, 5000);
  }
}