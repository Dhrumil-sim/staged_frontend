import { Component } from '@angular/core';
import { Router } from '@angular/router'; // ⬅️ Import Router
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LoginResponse, loginSchema } from '../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../../../services/loader.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule, NgIf, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  username = '';
  password = '';
  errorMsg = '';
  successMsg = '';
  generalError = '';
  showPassword = false;
  fieldErrors: Record<string, string> = {};

  constructor(
    private http: HttpClient,
    private router: Router, // ⬅️ Inject router here
    public loaderService: LoaderService,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateInputs() {
    this.fieldErrors = {};

    const result = loginSchema.validate(
      {
        email: this.email || undefined,
        username: this.username || undefined,
        password: this.password,
      },
      { abortEarly: false },
    );

    if (result.error) {
      for (const detail of result.error.details) {
        const key = detail.path[0];
        if (typeof key === 'string') {
          this.fieldErrors[key] = detail.message;
        }
      }
      return false;
    }

    return true;
  }

  login() {
    this.errorMsg = '';
    this.successMsg = '';
    this.generalError = '';
    this.fieldErrors = {};

    if (!this.validateInputs()) return;

    this.loaderService.show('local');

    const payload: { email?: string; username?: string; password: string } = {
      password: this.password,
    };

    if (this.email) payload.email = this.email;
    else if (this.username) payload.username = this.username;

    this.http
      .post<LoginResponse>('http://localhost:5000/api/user/login', payload, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.successMsg = res.message;
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('role', res.data.user.role); // Save role too

          if (res.data.user.role === 'artist') {
            localStorage.setItem('artistId', res.data.user._id); // Assuming artistId is in response
          }
          // 🧭 Role-based redirection
          const role = res.data.user.role;

          if (role === 'artist') {
            console.log('should navigate', role);
            this.router.navigate(['/artist']);
          } else if (role === 'user') {
            this.router.navigate(['/user/home']);
            console.log('user');
          } else {
            this.router.navigate(['/']); // default fallback
          }

          setTimeout(() => {
            this.loaderService.hide();
          }, 1000);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Login failed';
          this.loaderService.hide();
        },
      });
  }
}
