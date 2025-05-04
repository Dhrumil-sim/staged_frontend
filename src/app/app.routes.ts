import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { SignupComponent } from './modules/auth/components/signup/signup.component';
import { AuthGuard } from './auth.guard';
import { ArtistDashboardComponent } from './modules/artist-dashboard/artist-dashboard.component';
import { SongsFormComponent } from './modules/song/songs-form/songs-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: SignupComponent, pathMatch: 'full' },
  {
    path: 'songs/create',
    component: SongsFormComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'songs/edit/:id',
    component: SongsFormComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },

  {
    path: 'artist',
    component: ArtistDashboardComponent,
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
];
