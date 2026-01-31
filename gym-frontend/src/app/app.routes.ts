import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { adminGuard } from './shared/guards/admin.guard';

import { LandingPage } from './components/landing-page/landing-page';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { Profile } from './components/users/profile/profile';
import { ScheduleView } from './components/schedule/schedule-view/schedule-view';
import { UserListComponent } from './components/admin/user-list/user-list';
import { ScheduleAdminComponent } from './components/admin/schedule-admin/schedule-admin';

export const routes: Routes = [
  // Δημόσιες διαδρομές
  { path: '', component: LandingPage },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  // Προστατευμένες διαδρομές (απαιτείται σύνδεση)
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'schedule', component: ScheduleView, canActivate: [authGuard] },
  
  // Διαδρομές διαχειριστή (απαιτείται σύνδεση + admin δικαιώματα)
  { path: 'admin', redirectTo: 'schedule', pathMatch: 'full' },
  { path: 'admin/users', component: UserListComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/schedule', component: ScheduleAdminComponent, canActivate: [authGuard, adminGuard] },
  
  { path: '**', redirectTo: '' }
];