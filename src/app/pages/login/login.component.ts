import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router
import { CommonModule } from '@angular/common';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  isLoggedIn: boolean = false;  // Flag to track login state
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router  // Inject Router
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  // On Login button click
  onLogin() {
    this.http.post('http://localhost:8080/api/auth/login', this.loginForm.value)
      .subscribe({
        next: (res: any) => {
          console.log('Response:', res);  // Log the response to confirm its structure
          alert('Login Successful!');
          // After successful login, set the login state and navigate to search
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

  // On Logout button click
  onLogout() {
    // Handle logout (clear state and navigate back to the login page)
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  // On initialization, check login state (can be done using localStorage or sessionStorage)
  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }
}
