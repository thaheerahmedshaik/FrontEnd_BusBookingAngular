import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule],

})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
title:any
  constructor(private router: Router) {}

  ngOnInit() {
    // Check if the code is running in the browser before accessing localStorage
    if (typeof window !== 'undefined') {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      // If not logged in, navigate to the login page
      if (!this.isLoggedIn) {
        this.router.navigate(['/login']);
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      // Set the login state to false
      this.isLoggedIn = false;

      // Remove the login state from localStorage
      localStorage.removeItem('isLoggedIn');

      // Navigate to login page after logout
      this.router.navigate(['/login']);
    }
  }
}
