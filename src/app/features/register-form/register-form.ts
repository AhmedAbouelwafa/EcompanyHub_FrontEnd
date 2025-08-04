import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api-service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './register-form.html',
  styleUrls: ['./register-form.css']
})
export class RegisterForm {
  registerForm: FormGroup;
  isSupportMode = false;
  isSubmitting = false;
  errorMsg: string | null = null;
  token: string | null = null;
  previewUrl: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      arabicName: ['', [Validators.required, Validators.pattern(/^[\u0621-\u064A ]+$/)]],
      englishName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^\+\d{1,3}\d{9}$/)],
      websiteUrl: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)]],
      companyLogo: ['']
    });
  }

  get arabicName() {
    return this.registerForm.get('arabicName');
  }

  get englishName() {
    return this.registerForm.get('englishName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get websiteUrl() {
    return this.registerForm.get('websiteUrl');
  }

  get companyLogo() {
    return this.registerForm.get('companyLogo');
  }

  submit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.errorMsg = null;

      const formData = new FormData();
      formData.append('arabicName', this.arabicName?.value);
      formData.append('englishName', this.englishName?.value);
      formData.append('email', this.email?.value);
      formData.append('phone', this.phone?.value || '');
      formData.append('websiteUrl', this.websiteUrl?.value);

      const fileInput = document.getElementById('companyLogoInput') as HTMLInputElement;
      if (fileInput?.files?.length) {
        formData.append('companyLogo', fileInput.files[0]);
      }

      this.apiService.create(formData).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.data?.token) {
            this.token = res.data.token;
            localStorage.setItem('token', this.token || '');
            localStorage.setItem('email', this.email?.value);
            localStorage.setItem('companyLogo', res.data.companyLogoUrl || '');
            localStorage.setItem('companyName', this.arabicName?.value);
            this.router.navigate(['/token']);
          } else {
            this.errorMsg = 'فشل التسجيل: لم يتم استلام رمز التحقق';
            setTimeout(() => (this.errorMsg = null), 3000);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMsg = error.error?.errors?.[0] || 'حدث خطأ أثناء التسجيل';
          setTimeout(() => (this.errorMsg = null), 3000);
        }
      });
    } else {
      this.errorMsg = 'يرجى ملء جميع الحقول بشكل صحيح';
      setTimeout(() => (this.errorMsg = null), 3000);
    }
  }

  continueAsGuest() {
    // إعادة توجيه المستخدم إلى صفحة مخصصة للضيوف
    this.router.navigate(['/home']);
  }

  seedDatainForm() {
    this.registerForm.setValue({
      arabicName: 'شركة مثال',
      englishName: 'Example Company',
      email: 'ahmedmohamedbeh122@gmail.com',
      phone: '+201006445854',
      websiteUrl: 'https://fafafafaf.com',
      companyLogo: ''
    });
  }

  getToken() {
    return this.token ? this.token : null;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleMode() {
    this.isSupportMode = !this.isSupportMode;
  }
}
