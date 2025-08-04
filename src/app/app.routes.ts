import { Routes } from '@angular/router';
import { RegisterForm } from './features/register-form/register-form';
import { TokenVerificationComponent } from './features/token-verification/token-verification';
import { SetPasswordComponent } from './features/set-password/set-password';
import { LoginComponent } from './features/login/login';
import { HomeComponent } from './features/home/home';

export const routes: Routes = [
  { path: '', component: RegisterForm },
  { path: 'token', component: TokenVerificationComponent },
  { path: 'set-password', component: SetPasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
  