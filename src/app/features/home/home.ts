import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  companyName: string = '';
  companyLogo: string = '';
  isLoading = false;
  isGuest = false; // متغير جديد عشان نعرف لو المستخدم ضيف

  constructor(private router: Router) {}

  ngOnInit() {
    // Add entrance animation
    const card = document.querySelector('.token-verification__card');
    if (card) {
      card.classList.add('token-verification__card--animate');
    }

    // Load company data from localStorage
    this.companyName = localStorage.getItem('companyName') || '';
    this.companyLogo = localStorage.getItem('companyLogo') || '';

    // Check if user is a guest
    this.isGuest = !localStorage.getItem('token') && !localStorage.getItem('companyName');

    // If no token and not a guest, redirect to login
    if (!localStorage.getItem('token') && !this.isGuest) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.isLoading = true;
    // Clear all auth data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('companyName');
    localStorage.removeItem('companyLogo');
    localStorage.removeItem('isGuest'); // لو كنت ضيف، هنمسح كمان

    // Navigate to login page after 1 second
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1000);
  }
}
