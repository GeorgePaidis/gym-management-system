import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScheduleService } from '../../../shared/services/schedule.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ISchedule, IWorkoutClass } from '../../../shared/interfaces/schedule.interface';
import { signal } from '@angular/core';

@Component({
  selector: 'app-schedule-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './schedule-view.html',
  styleUrl: './schedule-view.css'
})
export class ScheduleView implements OnInit {
  scheduleService = inject(ScheduleService);
  authService = inject(AuthService);
  private cdRef = inject(ChangeDetectorRef);
  
  schedule: ISchedule | null = null;
  isLoading = signal(true);
  error: string = '';

  // Δομή ημερών για την προβολή
  days = [
    { key: 'monday', label: 'Δευτέρα', classes: [] as IWorkoutClass[] },
    { key: 'tuesday', label: 'Τρίτη', classes: [] as IWorkoutClass[] },
    { key: 'wednesday', label: 'Τετάρτη', classes: [] as IWorkoutClass[] },
    { key: 'thursday', label: 'Πέμπτη', classes: [] as IWorkoutClass[] },
    { key: 'friday', label: 'Παρασκευή', classes: [] as IWorkoutClass[] },
    { key: 'saturday', label: 'Σάββατο', classes: [] as IWorkoutClass[] },
    { key: 'sunday', label: 'Κυριακή', classes: [] as IWorkoutClass[] }
  ];

  ngOnInit() {
    this.loadSchedule();
  }

  // Φόρτωση προγράμματος από το API
  loadSchedule() {
    this.isLoading.set(true);
    this.error = '';
    this.cdRef.detectChanges();
    
    this.scheduleService.getSchedule().subscribe({
      next: (data) => {
        if (!data) {
          data = this.getEmptySchedule();
        }
        
        this.schedule = data;
        this.updateDaysSimple(data);
        this.isLoading.set(false);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.error = 'Αποτυχία φόρτωσης προγράμματος. Εμφάνιση δοκιμαστικών δεδομένων.';
        const demoData = this.getEmptySchedule();
        this.schedule = demoData;
        this.updateDaysSimple(demoData);
        this.isLoading.set(false);
        this.cdRef.detectChanges();
      }
    });
  }

  // Ενημέρωση των ημερών με τα δεδομένα από το πρόγραμμα
  updateDaysSimple(schedule: ISchedule) {
    if (!schedule) {
      this.days.forEach(day => day.classes = []);
      return;
    }
    
    this.days.forEach(day => {
      switch(day.key) {
        case 'monday':
          day.classes = Array.isArray(schedule.monday) ? [...schedule.monday] : [];
          break;
        case 'tuesday':
          day.classes = Array.isArray(schedule.tuesday) ? [...schedule.tuesday] : [];
          break;
        case 'wednesday':
          day.classes = Array.isArray(schedule.wednesday) ? [...schedule.wednesday] : [];
          break;
        case 'thursday':
          day.classes = Array.isArray(schedule.thursday) ? [...schedule.thursday] : [];
          break;
        case 'friday':
          day.classes = Array.isArray(schedule.friday) ? [...schedule.friday] : [];
          break;
        case 'saturday':
          day.classes = Array.isArray(schedule.saturday) ? [...schedule.saturday] : [];
          break;
        case 'sunday':
          day.classes = Array.isArray(schedule.sunday) ? [...schedule.sunday] : [];
          break;
        default:
          day.classes = [];
      }
    });
  }

  // Δημιουργία κενού προγράμματος για fallback
  getEmptySchedule(): ISchedule {
    return {
      _id: 'empty-schedule',
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  // Λήψη προπονήσεων για συγκεκριμένη ημέρα
  getClassesForDay(dayKey: string): IWorkoutClass[] {
    const day = this.days.find(d => d.key === dayKey);
    return day ? [...day.classes] : [];
  }

  get isAdmin() {
    return this.authService.isAdmin();
  }
}