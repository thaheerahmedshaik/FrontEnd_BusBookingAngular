import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ---------------- Interfaces ----------------

export interface Seat {
  id: number; 
  number: string;
  type?: string;
  deck?: string;
  price: number;
  available: boolean;
}

export interface Passenger {
  name: string;
  age: number;
  phone: string;
  state: string;
  gender: string;
  seatNumber: string;
}

export interface Contact {
  phone: string;
  email?: string;
  state: string;
  whatsapp?: boolean;
}

export interface BookingDTO {
  busId: number;
  seatIds: string[];
  passengers: Passenger[];
  boardingPoint: string;
  droppingPoint: string;
}

export interface Bus {
  id: number;
  name: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  fromCity?: string;
  toCity?: string;
  seatType?: string;
  rating?: string;
  amenities?: string;
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
 // selectedSeats: { number: string; price: number }[];
  selectedSeats: { id: number; number: string; price: number }[];

  totalAmount: number;
  boardingPoint?: string;
  droppingPoint?: string;
  passengers?: Passenger[];
  contact?: Contact;
  travelDate?: string; 
}
export interface BusPoint {
  id: number;
  name: string;
  time: string;
  type: 'BOARDING' | 'DROPPING';
  busId: number;
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

@Injectable({
  providedIn: 'root'
})
export class BusService {
  saveBooking(bookingData: Booking, selectedSeats: Seat[]) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/buses';
  private currentBooking: Booking | null = null;

  constructor(private http: HttpClient) {}

  /** Get list of buses */
  getBuses(from: string, to: string, date: string): Observable<Bus[]> {
    const params = new HttpParams().set('from', from).set('to', to).set('date', date);
    return this.http.get<Bus[]>(`${this.apiUrl}/search`, { params });
  }

  /** Get seats */
  getSeats(busId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/${busId}/seats`);
  }

  /** Boarding points */
  // getBoardingPoints(busId: number): Observable<BoardingPoint[]> {
  //   return this.http.get<BoardingPoint[]>(`${this.apiUrl}/${busId}/boarding-points`);
  // }

  // /** Dropping points */
  // getDroppingPoints(busId: number): Observable<DroppingPoint[]> {
  //   return this.http.get<DroppingPoint[]>(`${this.apiUrl}/${busId}/dropping-points`);
  // }

  /** Store current booking */
  setCurrentBooking(booking: Booking) {
    this.currentBooking = booking;
    localStorage.setItem('currentBooking', JSON.stringify(booking));
  }

  getCurrentBooking(): Booking | null {
    if (this.currentBooking) return this.currentBooking;
    const stored = localStorage.getItem('currentBooking');
    if (stored) this.currentBooking = JSON.parse(stored);
    return this.currentBooking;
  }

  clearBooking() {
    this.currentBooking = null;
    localStorage.removeItem('currentBooking');
  }

  // /** Book seats using BookingDTO */
  // bookSeat(dto: BookingDTO): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/bookSeat`, dto);
  // }


   bookSeat(booking: Booking): Observable<any> {
  const dto = {
    busId: booking.busId,
     seatIds: booking.selectedSeats.map((s) => s.id),
    passengers: booking.passengers,
    boardingPoint: booking.boardingPoint,
    droppingPoint: booking.droppingPoint,
  };
  return this.http.post(`${this.apiUrl}/bookSeat`, dto);
}

  
  getBoardingPoints(busId: number): Observable<BusPoint[]> {
  return this.http.get<BusPoint[]>(`${this.apiUrl}/${busId}/boarding`);
}

getDroppingPoints(busId: number): Observable<BusPoint[]> {
  return this.http.get<BusPoint[]>(`${this.apiUrl}/${busId}/dropping`);
}

confirmBooking(bookingData: Booking): Observable<Blob> {
  return this.http.post(`${this.apiUrl}/confirm`, bookingData, {
    responseType: 'blob'
  });
}

}
