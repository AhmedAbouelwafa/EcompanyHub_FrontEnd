import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api-service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './set-password.html',
  styleUrls: ['./set-password.css']
})
export class SetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  successMessage: string | null = null;
  errorMsg: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // استخدام CSS للرسوم المتحركة بدلاً من setTimeout
    const card = document.querySelector('.token-verification__card');
    if (card) {
      card.classList.add('token-verification__card--animate');
    }
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private showTemporaryMessage(message: string, type: 'success' | 'error', duration = 3000) {
    if (type === 'success') {
      this.showSuccess = true;
      this.successMessage = message;
    } else {
      this.errorMsg = message;
    }
    setTimeout(() => {
      this.showSuccess = false;
      this.successMessage = null;
      this.errorMsg = null;
    }, duration);
  }

  submit() {
    if (this.passwordForm.invalid) {
      this.showTemporaryMessage('يرجى إدخال كلمة مرور صالحة وتأكيدها', 'error');
      return;
    }

    this.isLoading = true;
    this.errorMsg = null;

    const storedToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!storedToken || !email) {
      this.isLoading = false;
      this.showTemporaryMessage('لا يوجد رمز تحقق أو بريد إلكتروني صالح', 'error');
      this.router.navigate(['/token']);
      return;
    }

    const setPasswordData = {
      token: storedToken,
      email,
      password: this.password?.value,
      confirmPassword: this.confirmPassword?.value
    };

    this.apiService.setPassword(setPasswordData).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.data) {
          this.showTemporaryMessage('تم تعيين كلمة المرور بنجاح!', 'success');
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.showTemporaryMessage(res.errors?.join(', ') || 'حدث خطأ أثناء تعيين كلمة المرور', 'error');
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errorMessage = err.status === 401
          ? 'رمز التحقق غير صالح أو منتهي الصلاحية'
          : err.error?.errors?.join(', ') || 'حدث خطأ أثناء تعيين كلمة المرور';
        this.showTemporaryMessage(errorMessage, 'error');
      }
    });
  }
}
