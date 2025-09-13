import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';  // <-- IMPORT THIS
import { ChatbotService } from '../chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // <-- ADD HERE
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  messages: { sender: string; text: string }[] = [];
  userInput = '';

  constructor(private chatService: ChatbotService) {}

  sendMessage() {
    const message = this.userInput.trim();
    if (!message) return;

    this.messages.push({ sender: 'user', text: message });

    this.chatService.sendMessage(message).subscribe((res) => {
      this.messages.push({ sender: 'bot', text: res.reply });
    });

    this.userInput = '';
  }
}
