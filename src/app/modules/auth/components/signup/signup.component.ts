import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../../../services/loader.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, ReactiveFormsModule, HttpClientModule],
})
export class SignupComponent {
  registerForm: FormGroup;
  profilePicture!: File | null;
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  fieldErrors: { [key: string]: string } = {};
  generalError = '';
  successMsg = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public loaderService: LoaderService,
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', [Validators.required]],
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      this.profilePicture = fileInput.files[0];
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.fieldErrors = {};
    this.generalError = '';
    this.successMsg = '';

    if (this.registerForm.invalid || !this.profilePicture) {
      this.generalError = 'Please fill all fields and upload a profile picture.';
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerForm.get('username')!.value);
    formData.append('email', this.registerForm.get('email')!.value);
    formData.append('password', this.registerForm.get('password')!.value);
    formData.append('role', this.registerForm.get('role')!.value);
    formData.append('profilePicture', this.profilePicture);

    this.loaderService.show('global');
    this.http.post('http://localhost:5000/api/user/register', formData).subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (res: any) => {
        this.successMsg = res.message || 'Registration successful!';
        this.registerForm.reset();
        this.profilePicture = null;
        this.loaderService.hide();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400 && err.error?.details) {
          for (const detail of err.error.details) {
            const path = detail.path[0];
            this.fieldErrors[path] = detail.message;
          }
        } else {
          this.generalError = err.error?.message || 'Something went wrong.';
        }
        this.loaderService.hide();
      },
    });
  }
}
