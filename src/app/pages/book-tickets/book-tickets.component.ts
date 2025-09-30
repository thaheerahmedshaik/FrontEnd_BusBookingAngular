import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-tickets',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.css']
})
export class BookTicketsComponent implements OnInit {
  buses: any[] = [];
  seats: any[] = [];
  selectedBus: any = null;
  selectedSeats: any[] = [];
  showSeatSelection = false;

  passengerForm: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.passengerForm = this.fb.group({
      passengers: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadBuses();
  }

  // Fetch all buses
  loadBuses(): void {
    this.http.get<any[]>('http://localhost:8080/buses').subscribe({
      next: (data) => this.buses = data,
      error: (err) => console.error('Error fetching buses:', err)
    });
  }

  // Open seat selection for a bus
  openSeatSelection(bus: any): void {
    this.selectedBus = bus;
    this.showSeatSelection = true;
    this.selectedSeats = [];
    (this.passengerForm.get('passengers') as FormArray).clear();

    this.http.get<any[]>(`http://localhost:8080/buses/seats/${bus.id}`).subscribe({
      next: (data) => this.seats = data,
      error: (err) => console.error('Error fetching seats:', err)
    });
  }

  // Toggle seat selection
  toggleSeat(seat: any): void {
    if (!seat.available) return;

    const index = this.selectedSeats.findIndex(s => s.id === seat.id);
    if (index === -1) {
      this.selectedSeats.push(seat);
      this.addPassengerForm();
    } else {
      this.selectedSeats.splice(index, 1);
      this.removePassengerForm(index);
    }
  }

  // Passenger form array
  get passengers(): FormArray {
    return this.passengerForm.get('passengers') as FormArray;
  }

  addPassengerForm(): void {
    this.passengers.push(
      this.fb.group({
        name: ['', Validators.required],
        age: ['', Validators.required],
        phone: ['', Validators.required],
        state: ['', Validators.required]
      })
    );
  }

  removePassengerForm(index: number): void {
    this.passengers.removeAt(index);
  }

  // Confirm booking
  confirmBooking(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    if (this.passengerForm.invalid) {
      alert('Please fill all passenger details');
      return;
    }

    const bookingDto = {
      busId: this.selectedBus.id,
      seatIds: this.selectedSeats.map(s => s.id),
      passengers: this.passengerForm.value.passengers,
      boardingPoint: 'Default Boarding',  // later you can add dropdown
      droppingPoint: 'Default Dropping'
    };

    this.http.post('http://localhost:8080/buses/bookSeat', bookingDto).subscribe({
      next: (res) => {
        alert('Booking successful!');
        this.showSeatSelection = false;
      },
      error: (err) => {
        console.error('Booking failed:', err);
        alert('Booking failed. Please try again.');
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
