import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors 
} from '@angular/forms';
import { AuthService, RegisterData } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register implements OnInit {
  private cdRef = inject(ChangeDetectorRef);
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  // Αρχικοποίηση φόρμας εγγραφής
  private initForm(): void {
    this.registerForm = this.fb.group({
      firstname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      lastname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      phone: ['', [
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100)
      ]],
      confirmPassword: ['', [
        Validators.required
      ]],
      newsletter: [true]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validator για έλεγχο αν οι κωδικοί ταιριάζουν
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  getFormControl(name: string) {
    return this.registerForm.get(name);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.getFormControl(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.getFormControl(fieldName);
    
    if (!field || !field.errors) return '';
    
    const errors = field.errors;
    if (errors['required']) return 'Το πεδίο αυτό είναι απαραίτητο';
    if (errors['email']) return 'Παρακαλώ εισάγετε έγκυρο email';
    if (errors['minlength']) return `Ελάχιστο ${errors['minlength'].requiredLength} χαρακτήρες`;
    if (errors['maxlength']) return `Μέγιστο ${errors['maxlength'].requiredLength} χαρακτήρες`;
    if (errors['pattern']) return 'Παρακαλώ εισάγετε έγκυρο 10ψήφιο αριθμό τηλεφώνου';
    if (errors['passwordMismatch']) return 'Οι κωδικοί δεν ταιριάζουν';
    
    return '';
  }

  // Υποβολή φόρμας εγγραφής
  onSubmit(): void {
    this.registerForm.markAllAsTouched();
    
    if (this.registerForm.invalid) {
      this.errorMessage = 'Παρακαλώ διορθώστε τα σφάλματα στη φόρμα';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.registerForm.value;
    
    const registerData: RegisterData = {
      email: formData.email,
      password: formData.password,
      firstname: formData.firstname,
      lastname: formData.lastname
    };

    // Προαιρετικό πεδίο τηλεφώνου
    if (formData.phone && formData.phone.trim() !== '') {
      registerData.phone = formData.phone;
    }

    this.authService.registerUser(registerData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Ο λογαριασμός δημιουργήθηκε επιτυχώς! Θα μεταφερθείτε στη σελίδα σύνδεσης σε 5 δευτερόλεπτα...';
        this.cdRef.detectChanges();

        // Αυτόματη ανακατεύθυνση μετά από 5 δευτερόλεπτα
        setTimeout(() => {
          this.router.navigate(['/login'], {
            queryParams: { 
              registered: 'true', 
              email: formData.email
            }
          });
        }, 5000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.cdRef.detectChanges();

        // Χειρισμός διαφορετικών τύπων σφαλμάτων
        if (error.status === 409) {
          this.errorMessage = 'Αυτό το email είναι ήδη εγγεγραμμένο. Παρακαλώ χρησιμοποιήστε διαφορετικό email ή δοκιμάστε σύνδεση.';
        } else if (error.status === 400) {
          this.errorMessage = 'Μη έγκυρα στοιχεία εγγραφής. Παρακαλώ ελέγξτε τα στοιχεία σας.';
        } else if (error.status === 0) {
          this.errorMessage = 'Αδυναμία σύνδεσης με τον server. Παρακαλώ ελέγξτε αν το backend εκτελείται στο http://localhost:3000';
        } else if (error.status === 500) {
          this.errorMessage = 'Σφάλμα server. Παρακαλώ δοκιμάστε ξανά αργότερα.';
        } else {
          this.errorMessage = error.error?.message || 'Αποτυχία εγγραφής. Παρακαλώ δοκιμάστε ξανά.';
        }
        this.cdRef.detectChanges();
      }
    });
  }

  // Έλεγχος εάν η φόρμα μπορεί να υποβληθεί
  canSubmit(): boolean {
    return this.registerForm.valid && !this.isLoading;
  }

  // Επαναφορά φόρμας
  resetForm(): void {
    this.registerForm.reset({
      newsletter: true
    });
    this.errorMessage = '';
    this.successMessage = '';
  }
}