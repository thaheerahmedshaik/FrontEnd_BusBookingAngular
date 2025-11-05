import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusService, Booking } from '../../bus.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css'],
})
export class MyBookingsComponent implements OnInit {
  bookingData!: Booking;

  constructor(private busService: BusService, private router: Router) {}

  ngOnInit(): void {
    const booking = this.busService.getCurrentBooking();
    if (booking) {
      this.bookingData = booking;
    } else {
      alert('No booking data found.');
      this.router.navigate(['/book-tickets']);
    }
  }

  confirmBooking() {
    if (!this.bookingData) {
      alert('Booking data missing!');
      return;
    }

    // ✅ Create DTO compatible with backend but derived from Booking
    const bookingPayload = {
      busId: this.bookingData.busId,
      seatIds: this.bookingData.selectedSeats.map((s) => s.id),
      boardingPoint: this.bookingData.boardingPoint,
      droppingPoint: this.bookingData.droppingPoint,
      passengers:
        this.bookingData.passengers?.map((p) => ({
          busId: this.bookingData.busId,
          seatId:
            this.bookingData.selectedSeats.find(
              (s) => s.number === p.seatNumber
            )?.id || 0,
          boardingPoint: this.bookingData.boardingPoint,
          droppingPoint: this.bookingData.droppingPoint,
          name: p.name,
          age: p.age,
          phone: p.phone,
          state: p.state,
        })) || [],
    };

    this.busService.confirmBooking(bookingPayload as unknown as Booking).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url); // Opens PDF ticket
        alert('Booking confirmed! Email sent.');
      },
      error: (err) => {
        console.error('Booking confirmation failed:', err);
        alert('Error confirming booking.');
      },
    });
  }
}
