import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService } from '../../../shared/services/user.service';
import { IUser } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  
  user: IUser | null = null;
  isLoading: boolean = true;
  isEditing: boolean = false;
  isSaving: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  
  profileForm: FormGroup;
  
  constructor() {
    this.profileForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validator: this.passwordMatchValidator });
  }
  
  ngOnInit() {
    this.loadUserProfile();
  }
  
  // Φόρτωση προφίλ χρήστη
  loadUserProfile() {
    this.isLoading = true;
    this.message = '';
    
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.populateForm(user);
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.showMessage('Αποτυχία φόρτωσης προφίλ', 'error');
        this.isLoading = false;
        
        if (error.status === 401) {
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        }
      }
    });
  }
  
  // Συμπλήρωση φόρμας με τα στοιχεία του χρήστη
  populateForm(user: IUser) {
    this.profileForm.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone || ''
    });
  }
  
  // Validator για έλεγχο αν οι νέοι κωδικοί ταιριάζουν
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  // Εναλλαγή μεταξύ προβολής και επεξεργασίας
  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.message = '';
    
    if (!this.isEditing) {
      this.populateForm(this.user!);
      this.profileForm.get('currentPassword')?.reset();
      this.profileForm.get('newPassword')?.reset();
      this.profileForm.get('confirmPassword')?.reset();
    }
  }
  
  // Αποθήκευση αλλαγών προφίλ
  saveProfile() {
    if (this.profileForm.invalid || !this.user) return;
    
    this.isSaving = true;
    this.message = '';
    this.cdRef.detectChanges();
    
    const formData = this.profileForm.getRawValue();
    const updateData: any = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      phone: formData.phone || undefined
    };
    
    // Προσθήκη κωδικού αν ο χρήστης θέλει να τον αλλάξει
    if (formData.newPassword) {
      updateData.password = formData.newPassword;
    }
    
    this.userService.updateProfile(this.user._id!, updateData).subscribe({
      next: (updatedUser) => {
        this.user = { ...updatedUser };
        
        this.authService.user.set({
          _id: updatedUser._id!,
          email: updatedUser.email,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          role: updatedUser.role
        });
        
        // Επανασυμπλήρωση φόρμας με ενημερωμένα δεδομένα
        this.populateForm(updatedUser);
        
        this.isEditing = false;
        this.isSaving = false;
        this.showMessage('Το προφίλ ενημερώθηκε επιτυχώς!', 'success');
        
        // Επαναφορά πεδίων κωδικού
        this.profileForm.get('currentPassword')?.reset();
        this.profileForm.get('newPassword')?.reset();
        this.profileForm.get('confirmPassword')?.reset();
        
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.isSaving = false;
      
        if (error.message?.includes('Email already exists') || error.status === 409) {
          this.showMessage('Αυτό το email χρησιμοποιείται ήδη. Παρακαλώ επιλέξτε άλλο email.', 'error');
        } else if (error.status === 400) {
          this.showMessage('Μη έγκυρα στοιχεία ενημέρωσης', 'error');
        } else if (error.status === 401) {
          this.showMessage('Δεν έχετε δικαίωμα για αυτή την ενέργεια. Παρακαλώ συνδεθείτε ξανά.', 'error');
        } else {
          this.showMessage(
            error.error?.message || 'Αποτυχία ενημέρωσης προφίλ. Παρακαλώ δοκιμάστε ξανά.',
            'error'
          );
        }
        
        this.cdRef.detectChanges();
      }
    });
  }
  
  // Εμφάνιση μηνύματος
  showMessage(text: string, type: 'success' | 'error') {
    this.message = text;
    this.messageType = type;
    this.cdRef.detectChanges();
    
    if (type === 'success') {
      setTimeout(() => {
        this.message = '';
        this.cdRef.detectChanges();
      }, 5000);
    }
  }
  
  get firstname() { return this.profileForm.get('firstname'); }
  get lastname() { return this.profileForm.get('lastname'); }
  get email() { return this.profileForm.get('email'); }
  get phone() { return this.profileForm.get('phone'); }
  get newPassword() { return this.profileForm.get('newPassword'); }
  get confirmPassword() { return this.profileForm.get('confirmPassword'); }
}