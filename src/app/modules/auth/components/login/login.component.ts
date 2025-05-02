import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoginResponse, loginSchema } from '../../interfaces/user';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, FormsModule, NgIf],
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

  constructor(private http: HttpClient) {}

  validateInputs() {
    this.fieldErrors = {}; // clear previous errors

    const result = loginSchema.validate(
      {
        email: this.email || undefined,
        username: this.username || undefined,
        password: this.password,
      },
      { abortEarly: false },
    );

    console.log(result);

    if (result.error) {
      for (const detail of result.error.details) {
        const key = detail.path[0];
        if (typeof key === 'string') {
          this.fieldErrors[key] = detail.message;
        } else {
          this.generalError = detail.message; // for xor/complex validations
        }
      }
      return false;
    }

    return true;
  }

  login() {
    if (!this.validateInputs()) return;

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
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Login failed';
          console.log(err);
        },
      });
  }
}
