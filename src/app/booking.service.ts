import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// ---------------- Interfaces ----------------

export interface Seat {
  number: string;
  type?: string;
  deck?: string;
  price: number;
  available: boolean;
}

export interface Bus {
  id: number;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;              // base fare (per-seat pricing if fixed)
  seatsAvailable: number;
  fromCity?: string;
  toCity?: string;
  seatType?: string;
  rating?: string;
  amenities?: string;
}

export interface Passenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;   // ✅ Added seat info
}

export interface Contact {
  phone: string;
  email: string;
  state: string;
  whatsapp: boolean;
}

export interface Booking {
  busId: number;
  busName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromCity: string;
  toCity: string;
  price: number;
  selectedSeats: { number: string; price: number }[];
  totalAmount: number;
  boardingPoint?: string;
  droppingPoint?: string;
  passengers?: Passenger[];
  contact?: Contact;   // ✅ Added
}

export interface BoardingPoint {
  id: number;
  location: string;
  time: string;
}

export interface DroppingPoint {
  id: number;
  location: string;
  time: string;
}

// ---------------- Service ----------------

@Injectable({ providedIn: 'root' })
export class BusBookingService {
  private currentBooking: Booking | null = null;
  private baseUrl = 'http://localhost:8080/api/whatsapp'; // ✅ Backend endpoint

  constructor(private http: HttpClient) {}

  // 🔄 Save booking (with persistence)
  setCurrentBooking(booking: Booking) {
    this.currentBooking = booking;
    localStorage.setItem('currentBooking', JSON.stringify(booking));
  }

  // 🔄 Retrieve booking (fallback to localStorage)
  getCurrentBooking(): Booking | null {
    if (this.currentBooking) {
      return this.currentBooking;
    }
    const storedBooking = localStorage.getItem('currentBooking');
    if (storedBooking) {
      this.currentBooking = JSON.parse(storedBooking);
      return this.currentBooking;
    }
    return null;
  }

  // 🔄 Clear booking
  clearBooking() {
    this.currentBooking = null;
    localStorage.removeItem('currentBooking');
  }

  // ✅ For debugging / flow testing
  completeBooking() {
    console.log('Booking completed:', this.currentBooking);
  }

  // ✅ API call to send booking details (e.g., WhatsApp)
  sendBooking(booking: Booking): Observable<any> {
    return this.http.post(`${this.baseUrl}/send`, booking);
  }
  
}
