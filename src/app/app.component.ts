import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotComponent } from './chatbot/chatbot.component';

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
  title:'Ecommerce-App' | undefined;

  constructor(private router: Router) {}

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!this.isLoggedIn) this.router.navigate(['/login']);
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
