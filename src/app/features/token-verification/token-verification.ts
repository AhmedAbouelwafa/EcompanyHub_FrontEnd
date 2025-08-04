import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-token-verification',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './token-verification.html',
  styleUrls: ['./token-verification.css']
})
export class TokenVerificationComponent implements OnInit {
  tokenForm!: FormGroup;
  isLoading = false;
  isVerified = false;
  showSuccess = false;
  successMessage: string | null = null;
  errorMsg: string | null = null;
  tokenString: string | null = null;

  constructor(private fb: FormBuilder , private router: Router ) {
    this.tokenForm = this.fb.group({
      token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]]
    });
  }

  ngOnInit() {
    // جلب الـ token من localStorage
    this.tokenString = localStorage.getItem('token');

    // Add entrance animation
    setTimeout(() => {
      const card = document.querySelector('.token-verification__card');
      if (card) {
        card.classList.add('token-verification__card--animate');
      }
    }, 100);
  }

  get token() {
    return this.tokenForm.get('token');
  }

  submit() {
    if (this.tokenForm.valid) {
      this.isLoading = true;
      this.showSuccess = false;
      this.errorMsg = null;

      // التحقق من أول 6 أو 7 أو 8 أحرف من الـ token
      const inputToken = this.token?.value.toString();
      const tokenPrefix6 = this.tokenString ? this.tokenString.slice(0, 6) : '';
      const tokenPrefix7 = this.tokenString ? this.tokenString.slice(0, 7) : '';
      const tokenPrefix8 = this.tokenString ? this.tokenString.slice(0, 8) : '';

      if (inputToken === tokenPrefix6 || inputToken === tokenPrefix7 || inputToken === tokenPrefix8) {
        this.isVerified = true;
        this.showSuccess = true;
        this.successMessage = 'تم التحقق من الرمز بنجاح!';
        setTimeout(() => {
          this.showSuccess = false;
          this.successMessage = null;
        }, 3000);
        this.router.navigate(['/set-password']);
      } else {
        this.isVerified = false;
        this.errorMsg = 'رمز التحقق غير صحيح';
        setTimeout(() => {
          this.errorMsg = null;
        }, 3000);
      }

      this.isLoading = false;
    }
  }


}
