import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent {
  messages: { sender: string; text: string }[] = [];
  userInput: string = '';

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({ sender: 'user', text: this.userInput });

    // Get bot response
    const reply = this.chatbotService.getResponse(this.userInput);
    setTimeout(() => {
      this.messages.push({ sender: 'bot', text: reply });
    }, 500);

    // Clear input
    this.userInput = '';
  }
}
