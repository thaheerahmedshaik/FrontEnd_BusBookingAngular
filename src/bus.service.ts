import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Import Observable
import { delay } from 'rxjs/operators';

export interface Bus {
  id: number;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
}

export interface Booking {
  busName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  selectedSeats: { number: string, price: number }[];
  totalAmount: number;
  boardingPoint: string;
  droppingPoint: string;
}

@Injectable({
  providedIn: 'root',
})
export class BusService {
  private currentBooking: Booking | null = null;

  getBuses(from: string, to: string, date: string): Observable<Bus[]> {
    const mockBuses: Bus[] = [
      {
        id: 1,
        name: 'Orange Travels AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 1200,
        seatsAvailable: 12,
      },
      {
        id: 2,
        name: 'Ravi Travels AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 1100,
        seatsAvailable: 12,
      },
      {
        id: 3,
        name: 'Zigbus Travels AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 1100,
        seatsAvailable: 12,
      },
      {
        id: 4,
        name: 'Sureka Travels AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 900,
        seatsAvailable: 12,
      },
    ];

    return of(mockBuses).pipe(delay(800));
  }

  // Method to set current booking
  setCurrentBooking(booking: Booking) {
    this.currentBooking = booking;
  }

  // Method to get current booking
  getCurrentBooking(): Booking | null {
    return this.currentBooking;
  }

  // Method to complete the booking (e.g., finalize, store it in DB, etc.)
  completeBooking() {
    console.log('Booking completed:', this.currentBooking);
    this.currentBooking = null; // Optionally clear the current booking after completion
  }
}
