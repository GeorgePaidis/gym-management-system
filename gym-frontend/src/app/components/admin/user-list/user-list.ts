import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { IUser } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css']
})
export class UserListComponent implements OnInit {
  userService = inject(UserService);
  private cdRef = inject(ChangeDetectorRef);
  
  users: IUser[] = [];
  filteredUsers: IUser[] = [];
  searchTerm: string = '';
  loading = true;
  
  errorMessage: string = '';
  successMessage: string = '';
  
  showAddModal = false;
  newUser = {
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    password: '',
    role: 'MEMBER' as 'ADMIN' | 'MEMBER'
  };
  
  selectedUser: IUser | null = null;
  editMode = false;

  ngOnInit() {
    this.loadUsers();
  }

  // Φόρτωση λίστας χρηστών από το API
  loadUsers() {
    this.loading = true;
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        if (!Array.isArray(users)) users = [];
        
        if (users.length === 0) {
          users = this.getDemoUsers();
        }
        
        this.users = [...users];
        this.filteredUsers = [...users];
        this.loading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Σφάλμα διακομιστή. Εμφάνιση δοκιμαστικών δεδομένων.';
        this.users = this.getDemoUsers();
        this.filteredUsers = [...this.users];
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  // Δοκιμαστικά δεδομένα για προεπισκόπηση
  getDemoUsers(): IUser[] {
    return [
      {
        _id: '1',
        email: 'admin@gym.com',
        firstname: 'Admin',
        lastname: 'User',
        role: 'ADMIN',
        joinDate: new Date('2024-01-01')
      },
      {
        _id: '2',
        email: 'john@gym.com',
        firstname: 'John',
        lastname: 'Doe',
        phone: '1234567890',
        role: 'MEMBER',
        joinDate: new Date('2024-01-15')
      }
    ];
  }

  filterUsers() {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.firstname.toLowerCase().includes(term) ||
      user.lastname.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

  // Άνοιγμα modal για προσθήκη νέου χρήστη
  openAddModal() {
    this.newUser = {
      email: '',
      firstname: '',
      lastname: '',
      phone: '',
      password: '',
      role: 'MEMBER'
    };
    
    this.showAddModal = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdRef.detectChanges();
  }

  // Δημιουργία νέου χρήστη
  addNewUser() {
    if (!this.newUser.email || !this.newUser.firstname || !this.newUser.lastname) {
      this.errorMessage = 'Παρακαλώ συμπληρώστε email, όνομα και επώνυμο';
      this.cdRef.detectChanges();
      return;
    }
    
    if (!this.newUser.password || this.newUser.password.length < 6) {
      this.errorMessage = 'Ο κωδικός πρέπει να είναι τουλάχιστον 6 χαρακτήρες';
      this.cdRef.detectChanges();
      return;
    }
    
    const userData = {
      email: this.newUser.email,
      password: this.newUser.password,
      firstname: this.newUser.firstname,
      lastname: this.newUser.lastname,
      phone: this.newUser.phone || undefined,
      role: this.newUser.role
    };
    
    this.userService.createUser(userData).subscribe({
      next: (createdUser) => {
        this.users = [...this.users, createdUser];
        this.filteredUsers = [...this.users];
        
        this.successMessage = `Το μέλος ${createdUser.email} προστέθηκε επιτυχώς!`;
        this.showAddModal = false;
        
        setTimeout(() => {
          this.successMessage = '';
          this.cdRef.detectChanges();
        }, 3000);
        
        this.cdRef.detectChanges();
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = 'Αυτό το email είναι ήδη εγγεγραμμένο';
        } else if (error.status === 400) {
          this.errorMessage = 'Μη έγκυρα στοιχεία χρήστη';
        } else {
          this.errorMessage = error.error?.message || 'Αποτυχία προσθήκης χρήστη. Παρακαλώ δοκιμάστε ξανά.';
        }
        this.cdRef.detectChanges();
      }
    });
  }

  // Επεξεργασία υπάρχοντος χρήστη
  editUser(user: IUser) {
    this.selectedUser = { ...user };
    this.editMode = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdRef.detectChanges();
  }

  // Αποθήκευση αλλαγών χρήστη
  saveUser() {
    if (!this.selectedUser || !this.selectedUser._id) return;
    
    const updateData = {
      firstname: this.selectedUser.firstname,
      lastname: this.selectedUser.lastname,
      email: this.selectedUser.email,
      phone: this.selectedUser.phone || undefined,
      role: this.selectedUser.role
    };
    
    this.userService.updateProfile(this.selectedUser._id, updateData).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.filteredUsers = [...this.users];
        }
        
        this.editMode = false;
        this.selectedUser = null;
        this.successMessage = 'Ο χρήστης ενημερώθηκε επιτυχώς!';
        
        setTimeout(() => {
          this.successMessage = '';
          this.cdRef.detectChanges();
        }, 3000);
        
        this.cdRef.detectChanges();
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorMessage = 'Αυτό το email χρησιμοποιείται ήδη';
        } else if (error.status === 400) {
          this.errorMessage = 'Μη έγκυρα στοιχεία ενημέρωσης';
        } else {
          this.errorMessage = error.error?.message || 'Αποτυχία ενημέρωσης χρήστη.';
        }
        this.cdRef.detectChanges();
      }
    });
  }

  // Διαγραφή χρήστη
  deleteUser(userId: string) {
    if (!confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε αυτόν τον χρήστη;')) return;
    
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(user => user._id !== userId);
        this.filteredUsers = this.filteredUsers.filter(user => user._id !== userId);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        alert('Αποτυχία διαγραφής χρήστη.');
        this.cdRef.detectChanges();
      }
    });
  }

  closeAddModal() {
    this.showAddModal = false;
    this.errorMessage = '';
    this.cdRef.detectChanges();
  }

  closeEditModal() {
    this.editMode = false;
    this.selectedUser = null;
    this.errorMessage = '';
    this.cdRef.detectChanges();
  }
}