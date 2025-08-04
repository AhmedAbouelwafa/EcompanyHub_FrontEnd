import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMsg: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Add entrance animation
    setTimeout(() => {
      const card = document.querySelector('.token-verification__card');
      if (card) {
        card.classList.add('token-verification__card--animate');
      }
    }, 100);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  submit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMsg = null;

      const loginData = {
        email: this.email?.value,
        password: this.password?.value
      };

      this.apiService.login(loginData).subscribe({
        next: (res) => {
          if (res.data && res.data.token) {
            // Store token and company data in localStorage
            localStorage.setItem('authToken', res.data.token);
            localStorage.setItem('companyName', res.data.companyName);
            localStorage.setItem('companyLogo', res.data.companyLogo);

            // Navigate to home page
            this.router.navigate(['/home']);
          } else {
            this.errorMsg = 'فشل تسجيل الدخول: بيانات غير صحيحة';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = err.error?.errors?.join(', ') || 'حدث خطأ أثناء تسجيل الدخول';
        }
      });
    }
    this.router.navigate(['/home']);

  }
}
