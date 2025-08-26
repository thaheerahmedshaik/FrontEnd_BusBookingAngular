import { Injectable } from '@angular/core';

export interface Passenger {
  name: string;
  age: number;
  gender: string;
}

export interface BookingDetails {
  busName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  passengers: Passenger[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingData: BookingDetails | null = null;

  setBooking(data: BookingDetails) {
    this.bookingData = data;
  }

  getBooking(): BookingDetails | null {
    return this.bookingData;
  }

  clearBooking() {
    this.bookingData = null;
  }
}
