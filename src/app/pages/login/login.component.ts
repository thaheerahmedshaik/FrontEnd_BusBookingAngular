import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../environments/environment'; // ✅ use generic environment

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  isLoggedIn = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onLogin() {
    this.http.post(`${environment.apiUrl}/api/auth/login`, this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          console.log('Response:', res);
          alert('Login Successful!');
          this.isLoggedIn = true;
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/search']);
        },
        error: err => {
          console.error('Error:', err);
          alert('An error occurred. Please try again later.');
        }
      });
  }

  onLogout() {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }
}
