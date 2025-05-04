import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (accessToken && role === 'artist') {
      return true;
    }

    // Optional: redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
