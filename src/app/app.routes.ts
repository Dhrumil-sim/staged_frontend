import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { SignupComponent } from './modules/auth/components/signup/signup.component';
import { AuthGuard } from './auth.guard';
import { ArtistDashboardComponent } from './modules/artist-dashboard/artist-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: SignupComponent, pathMatch: 'full' },

  {
    path: 'artist',
    component: ArtistDashboardComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
];
