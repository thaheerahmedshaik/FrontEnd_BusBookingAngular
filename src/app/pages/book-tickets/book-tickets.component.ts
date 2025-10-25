import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // <-- ADDED for Boarding/Dropping select

import { Router } from '@angular/router'; // <-- ADDED for navigation

@Component({
  selector: 'app-book-tickets',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // <-- Included FormsModule
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.css']
})
export class BookTicketsComponent implements OnInit {
  buses: any[] = [];
  seats: any[] = [];
  selectedBus: any = null;
  selectedSeats: any[] = [];
  showSeatSelection = false;
  
  // Variables for Boarding/Dropping Points
  boardingPoints: any[] = [];
  droppingPoints: any[] = [];
  selectedBoarding: any = null; // Will store the selected point object
  selectedDropping: any = null; // Will store the selected point object

  // Inject HttpClient and Router
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  // Getter for total price calculation (Fix for Parser Error)
  get totalPrice(): number {
    if (!this.selectedSeats || this.selectedSeats.length === 0) {
      return 0;
    }
    return this.selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  }

  // Fetch all buses
  loadBuses(): void {
    this.http.get<any[]>('http://localhost:8080/buses').subscribe({
      next: (data) => this.buses = data,
      error: (err) => console.error('Error fetching buses:', err)
    });
  }

  // Open seat selection for a bus and fetch data
  openSeatSelection(bus: any): void {
    this.selectedBus = bus;
    this.showSeatSelection = true;
    this.selectedSeats = [];
    this.selectedBoarding = null;
    this.selectedDropping = null;

    // 1. Fetch Seats
    this.http.get<any[]>(`http://localhost:8080/buses/${bus.id}/seats`).subscribe({
      next: (data) => this.seats = data,
      error: (err) => console.error('Error fetching seats:', err)
    });

    // 2. Fetch Boarding Points
    this.http.get<any[]>(`http://localhost:8080/buses/${bus.id}/boarding`).subscribe({
      next: (data) => {
        this.boardingPoints = data;
        if (data.length > 0) this.selectedBoarding = data[0]; // Auto-select first point
      },
      error: (err) => console.error('Error fetching boarding points:', err)
    });

    // 3. Fetch Dropping Points
    this.http.get<any[]>(`http://localhost:8080/buses/${bus.id}/dropping`).subscribe({
      next: (data) => {
        this.droppingPoints = data;
        if (data.length > 0) this.selectedDropping = data[0]; // Auto-select first point
      },
      error: (err) => console.error('Error fetching dropping points:', err)
    });
  }

  // Toggle seat selection
  toggleSeat(seat: any): void {
    if (!seat.available) return;

    const index = this.selectedSeats.findIndex(s => s.id === seat.id);
    if (index === -1) {
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats.splice(index, 1);
    }
  }

  // Navigate to the customer data entry form
  proceedToCustomerData(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    if (!this.selectedBoarding || !this.selectedDropping) {
      alert('Please select both a Boarding and Dropping point.');
      return;
    }

    // Prepare the data to pass to the next component
    const bookingData = {
      busId: this.selectedBus.id,
      busName: this.selectedBus.busName,
      selectedSeats: this.selectedSeats,
      boardingPoint: `${this.selectedBoarding.pointName} (${this.selectedBoarding.time})`,
      droppingPoint: `${this.selectedDropping.pointName} (${this.selectedDropping.time})`,
      totalAmount: this.totalPrice
    };

    // Navigate using router state
    this.router.navigate(['/customer-data'], { 
      state: { 
        bookingData: bookingData 
      } 
    });
  }

  // TrackBy functions
  trackByBusId(index: number, bus: any): number {
    return bus.id;
  }

  trackBySeatId(index: number, seat: any): number {
    return seat.id;
  }
}