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
  email: string | undefined = '';
  username: string | undefined = '';
  password = '';
  errorMsg = '';
  successMsg = '';
  generalError = '';
  showPassword = false;
  loginIdentifier = '';
  fieldErrors: Record<string, string> = {};

  constructor(
    private http: HttpClient,
    private router: Router, // ⬅️ Inject router here
    public loaderService: LoaderService,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  isValidEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  }
  validateInputs() {
    this.fieldErrors = {};
    const isEmail = this.isValidEmail(this.loginIdentifier);
    const isUsername = !isEmail && this.loginIdentifier.trim().length;
    if (isEmail) {
      this.username = undefined;
      this.email = this.loginIdentifier;
    }
    if (isUsername) {
      this.email = undefined;
      this.username = this.loginIdentifier;
    }

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

    this.loaderService.show('global');

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
            this.router.navigate(['/artist']);
          } else if (role === 'user') {
            this.router.navigate(['/user/home']);
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
