import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { Credentials } from '../../../shared/interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  invalidLogin: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  // Reactive Form για login
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  // Υποβολή φόρμας σύνδεσης
  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.invalidLogin = false;

    this.authService.loginUser(this.form.value as Credentials)
      .subscribe({
        next: (response) => {
          this.authService.handleLoginSuccess(response);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.invalidLogin = true;
          
          if (error.status === 401) {
            this.errorMessage = 'Λάθος email ή κωδικός πρόσβασης';
          } else if (error.status === 0) {
            this.errorMessage = 'Δεν υπάρχει σύνδεση με το διακομιστή';
          } else {
            this.errorMessage = 'Σφάλμα κατά τη σύνδεση';
          }
          
          this.form.get('password')?.reset();
        }
      });
  }

  // Βοηθητικές μέθοδοι για πρόσβαση στα form controls από το template
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
}