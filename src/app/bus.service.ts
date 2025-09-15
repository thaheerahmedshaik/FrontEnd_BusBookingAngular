import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Seat {
  number: string;
  type: string;
  deck: string;
  price: number;
  available: boolean;
}

export interface Bus {
  id: number;
  name: string;            // bus name
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  fromCity?: string;       // optional, if backend provides
  toCity?: string;
  seatType?:string;
  rating?:string;
  amenities?:string;
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

@Injectable({
  providedIn: 'root'
})
export class BusService {
  sendBooking(booking: { name: any; age: any; phone: string; state: string; }) {
    throw new Error('Method not implemented.');
  }
  getSearchParams() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:8080/buses'; // Spring Boot URL

  constructor(private http: HttpClient) { }

  getBuses(from: string, to: string, date: string): Observable<Bus[]> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('date', date);
    return this.http.get<Bus[]>(`${this.apiUrl}/search`, { params });
  }

  getSeats(busId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/${busId}/seats`);
  }

  getBoardingPoints(busId: number): Observable<BoardingPoint[]> {
    return this.http.get<BoardingPoint[]>(`${this.apiUrl}/${busId}/boarding-points`);
  }

  getDroppingPoints(busId: number): Observable<DroppingPoint[]> {
    return this.http.get<DroppingPoint[]>(`${this.apiUrl}/${busId}/dropping-points`);
  }
}
