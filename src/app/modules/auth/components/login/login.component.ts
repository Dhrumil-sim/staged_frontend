import { Component } from '@angular/core';
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
  fieldErrors: Record<string, string> = {};

  constructor(
    private http: HttpClient,
    public loaderService: LoaderService, // Inject LoaderService
  ) {}

  validateInputs() {
    this.fieldErrors = {}; // Clear previous errors

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

    // Show the loader manually before the API call
    this.loaderService.show('local'); // Show the global loader

    const payload: { email?: string; username?: string; password: string } = {
      password: this.password,
    };

    if (this.email) payload.email = this.email;
    else if (this.username) payload.username = this.username;

    // Make the HTTP request
    this.http
      .post<LoginResponse>('http://localhost:5000/api/user/login', payload, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.successMsg = res.message;
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          // Hide the loader on success
          // 👇 Delay the loader hide by 1 second (1000 ms)
          setTimeout(() => {
            this.loaderService.hide();
          }, 1000);
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Login failed';
          // Hide the loader on error
          this.loaderService.hide();
        },
      });
  }
}
