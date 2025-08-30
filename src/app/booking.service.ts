import { Injectable } from '@angular/core';

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
}

@Injectable({ providedIn: 'root' })
export class BusService {
  private currentBooking: Booking | null = null;

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
}
