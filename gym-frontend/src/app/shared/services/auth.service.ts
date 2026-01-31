import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { Credentials, LoggedInUser, IUser } from '../interfaces/user.interface';

export interface RegisterData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  user = signal<LoggedInUser | null>(null);

  constructor() {
    this.checkStoredToken();
  }

  // Έλεγχος για αποθηκευμένο JWT token κατά την εκκίνηση
  private checkStoredToken() {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      try {
        const decodedToken = jwtDecode(access_token) as LoggedInUser;
        this.user.set(decodedToken);
      } catch (error) {
        localStorage.removeItem('access_token');
      }
    }
  }

  // Σύνδεση χρήστη
  loginUser(credentials: Credentials) {
    return this.http.post<{ token: string; user: IUser }>(
      `${environment.apiUrl}/api/auth/login`,
      credentials
    );
  }

  // Εγγραφή νέου χρήστη
  registerUser(userData: RegisterData) {
    return this.http.post<{ token: string; user: IUser }>(
      `${environment.apiUrl}/api/auth/register`,
      userData
    );
  }

  // Χειρισμός επιτυχούς σύνδεσης
  handleLoginSuccess(response: { token: string; user: any }) {
    const access_token = response.token;
    const userData = response.user;
    
    // Αποθήκευση token στο localStorage
    localStorage.setItem('access_token', access_token);
    
    this.user.set({
      _id: userData._id,
      email: userData.email,
      firstname: userData.firstname,
      lastname: userData.lastname,
      role: userData.role
    });
    
    // Ανακατεύθυνση βάσει ρόλου χρήστη
    setTimeout(() => {
      if (userData.role === 'ADMIN') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/schedule']);
      }
    }, 100);
  }

  handleLoginError(error: any) {
    return error;
  }

  // Αποσύνδεση χρήστη
  logoutUser() {
    this.user.set(null);
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  // Έλεγχος αν ο χρήστης είναι διαχειριστής
  isAdmin(): boolean {
    return this.user()?.role === 'ADMIN';
  }

  // Έλεγχος αν ο χρήστης είναι συνδεδεμένος
  isLoggedIn(): boolean {
    return !!this.user();
  }
}