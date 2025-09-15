import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Passenger {
  name: string;
  age: number;
  gender: string;
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
  selectedSeats: string[];
  totalAmount: number;
  boardingPoint?: string;
  droppingPoint?: string;
  passengers?: Passenger[]; 
}

@Injectable({ providedIn: 'root' })
export class BusBookingService {
  private currentBooking: Booking | null = null;
 private baseUrl = 'http://localhost:8080/api/whatsapp';

  constructor(private http: HttpClient) {}


  setCurrentBooking(booking: Booking) {
    this.currentBooking = booking;
  }

  getCurrentBooking(): Booking | null {
    return this.currentBooking;
  }

  clearBooking() {
    this.currentBooking = null;
  }

    // ✅ Add this so PaymentDetailsComponent works
  completeBooking() {
    console.log("Booking completed:", this.currentBooking);
    // here you could store booking in DB or localStorage
  }
sendBooking(booking: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/send`, booking); // expects JSON
  }

}
