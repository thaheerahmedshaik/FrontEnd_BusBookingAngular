import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private responses: { [key: string]: string } = {
    hello: 'Hi there! 👋 How can I help you today?',
    book: 'You can book tickets by going to the Bus Booking page.',
    help: 'Sure! I can help you navigate the app.',
  };

  getResponse(message: string): string {
    const lowerMsg = message.toLowerCase();
    for (let key in this.responses) {
      if (lowerMsg.includes(key)) {
        return this.responses[key];
      }
    }
    return "I'm not sure about that 🤔, but I'm learning!";
  }
}
