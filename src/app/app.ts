import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterForm } from './features/register-form/register-form';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'ECompany-Hub';
}
