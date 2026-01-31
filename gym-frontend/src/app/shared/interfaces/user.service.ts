import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IUser } from '../interfaces/user.interface';

const API_URL = `${environment.apiUrl}/api/users`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  // Ανάκτηση προφίλ χρήστη
  getProfile(): Observable<IUser> {
    return this.http.get<IUser>(`${API_URL}/profile`).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  // Ενημέρωση προφίλ χρήστη
  updateProfile(userId: string, userData: Partial<IUser>): Observable<IUser> {
    return this.http.put<IUser>(`${API_URL}/${userId}`, userData).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  // Ανάκτηση όλων των χρηστών (μόνο για διαχειριστές)
  getAllUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${API_URL}`).pipe(
      catchError(error => {
        return of([]);
      })
    );
  }

  // Διαγραφή χρήστη
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${API_URL}/${userId}`).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  // Δημιουργία νέου χρήστη
  createUser(userData: Partial<IUser>): Observable<IUser> {
    return this.http.post<IUser>(`${API_URL}`, userData).pipe(
      catchError(error => {
        throw error;
      })
    );
  }
}