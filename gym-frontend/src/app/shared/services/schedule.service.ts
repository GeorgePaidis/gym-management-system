import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ISchedule, IWorkoutClass } from '../interfaces/schedule.interface';

const API_URL = `${environment.apiUrl}/api/schedule`;

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  http = inject(HttpClient);

  // Λήψη ολόκληρου του προγράμματος
  getSchedule(): Observable<ISchedule> {
    return this.http.get<ISchedule>(API_URL).pipe(
      catchError((error: HttpErrorResponse) => {
        // Σε περίπτωση σφάλματος, επιστρέφεται κενό πρόγραμμα
        const emptySchedule: ISchedule = {
          _id: "error-fallback",
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
        
        return of(emptySchedule);
      })
    );
  }

  // Ενημέρωση ολόκληρου προγράμματος (μόνο για διαχειριστές)
  updateSchedule(schedule: ISchedule): Observable<ISchedule> {
    return this.http.put<ISchedule>(API_URL, schedule).pipe(
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  // Προσθήκη νέου μαθήματος σε συγκεκριμένη ημέρα (μόνο για διαχειριστές)
  addClass(day: string, classData: IWorkoutClass): Observable<ISchedule> {
    return this.http.post<ISchedule>(`${API_URL}/add-class`, {
      day,
      time: classData.time,
      name: classData.name
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  // Αφαίρεση μαθήματος από συγκεκριμένη ημέρα (μόνο για διαχειριστές)
  removeClass(day: string, time: string, name: string): Observable<ISchedule> {
    return this.http.post<ISchedule>(`${API_URL}/remove-class`, {
      day,
      time,
      name
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }
}