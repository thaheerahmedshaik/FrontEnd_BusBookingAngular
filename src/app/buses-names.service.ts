// bus.service.ts
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

@Injectable({
  providedIn: 'root'
})
export class BusService {
  completeBooking() {
    throw new Error('Method not implemented.');
  }
  getBuses(from: string, to: string, date: string): Observable<Bus[]> { // Add return type
    // Mock data
    const mockBuses: Bus[] = [
      {
        id: 1,
        name: 'Orange Travels AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 1200,
        seatsAvailable: 12
      },
      {
        id: 2,
        name: 'Ravi Travels AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 1100,
        seatsAvailable: 12
      },
      {
        id: 3,
        name: 'Zigbus Travels AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 1100,
        seatsAvailable: 12
      },
      {
        id: 4,
        name: 'Sureka Travels AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 900,
        seatsAvailable: 12
      },
      {
        id: 4,
        name: 'Rakesh Travels NON AC Sleeper',
        departureTime: '22:30',
        arrivalTime: '07:00',
        duration: '8h 30m',
        price: 900,
        seatsAvailable: 12
      }
    ];

    return of(mockBuses).pipe(delay(800)); // Return the Observable
  }
}