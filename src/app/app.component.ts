import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotComponent } from './chatbot/chatbot.component';

// If using npm package:
// import SwaggerUI from 'swagger-ui-dist';
// If using CDN, just declare it:
declare const SwaggerUI: any;

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule, ChatbotComponent]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  chatOpen = false;
  title: 'Ecommerce-App' | undefined;

  constructor(private router: Router) {}

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!this.isLoggedIn) this.router.navigate(['/login']);

      // Initialize Swagger UI only if user is logged in
      if (this.isLoggedIn) {
        SwaggerUI({
          dom_id: '#swagger-container',
          url: 'http://localhost:8080/v3/api-docs', // Spring Boot OpenAPI URL
          presets: [SwaggerUI.presets.apis],
          layout: 'BaseLayout',
        });
      }
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      this.isLoggedIn = false;
      localStorage.removeItem('isLoggedIn');
      this.router.navigate(['/login']);
    }
  }
}
