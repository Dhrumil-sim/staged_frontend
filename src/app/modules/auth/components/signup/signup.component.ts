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
import { Router } from '@angular/router';

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
  fieldErrors: Record<string, string> = {};
  generalError = '';
  successMsg = '';
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public loaderService: LoaderService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        role: ['user', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
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

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.fieldErrors = {};
    this.generalError = '';
    this.successMsg = '';

    if (this.registerForm.invalid || !this.profilePicture) {
      if (!this.profilePicture) {
        this.fieldErrors['profilePicture'] = 'Profile picture is required.';
      }
      this.generalError = 'Please correct the errors and try again.';
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerForm.get('username')!.value);
    formData.append('email', this.registerForm.get('email')!.value);
    formData.append('password', this.registerForm.get('password')!.value);
    formData.append('role', this.registerForm.get('role')!.value);
    formData.append('profilePicture', this.profilePicture);

    this.loaderService.show('local');
    this.isSubmitting = true;

    this.http.post('http://localhost:5000/api/user/register', formData).subscribe({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      next: (res: any) => {
        this.successMsg = res.message || 'Registration successful!';
        this.registerForm.reset();
        this.profilePicture = null;
        this.loaderService.hide();
        this.isSubmitting = false;

        setTimeout(() => {
          this.loaderService.hide();
          this.router.navigate(['/login']); // 👈 Navigate to login
        }, 1000); // optional delay for user to see success message
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.status);
        if (err.status === 400 && err.error?.details) {
          for (const detail of err.error.details) {
            const path = detail.path[0];
            this.fieldErrors[path] = detail.message;
          }
        } else if (err.status === 409) {
          // Handle "User already exists"
          this.generalError = err.error?.status || 'User already exists.';
        } else {
          this.generalError = err.error?.message || 'Something went wrong. Please try again.';
        }
        this.loaderService.hide();
        this.isSubmitting = false;
      },
    });
  }
}
