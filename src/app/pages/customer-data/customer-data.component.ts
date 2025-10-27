import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Booking, BusBookingService, Passenger } from '../../booking.service';

@Component({
  selector: 'app-customer-data',
  standalone: true,
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.css'],
  imports: [CommonModule, FormsModule],
})
export class CustomerDataComponent implements OnInit {
  bookingData!: Booking;
  passengers: Passenger[] = [];
  contact = { phone: '', email: '', state: '', whatsapp: true };
  states = ['Telangana', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Kerala'];

  constructor(private router: Router, private busService: BusBookingService) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();

    if (nav?.extras.state?.['bookingData']) {
      // If booking data was passed via router state
      this.bookingData = nav.extras.state['bookingData'];
      this.busService.setCurrentBooking(this.bookingData);
    } else {
      // If the user refreshed the page, retrieve from localStorage
      const savedBooking = this.busService.getCurrentBooking();
      if (savedBooking) {
        this.bookingData = savedBooking;
      } else {
        alert('No booking found! Redirecting.');
        this.router.navigate(['/book-tickets']);
        return;
      }
    }

    // Create passenger placeholders for selected seats
    this.passengers = this.bookingData.selectedSeats.map((seat) => ({
      name: '',
      age: 0,
      gender: 'Male',
      seatNumber: seat.number,
    }));
  }

  get totalFare(): number {
    if (!this.bookingData?.selectedSeats) return 0;
    return this.bookingData.selectedSeats.reduce(
      (sum, s) => sum + (s.price || 0),
      0
    );
  }

  proceedToPayment(form: NgForm) {
    if (!this.bookingData) {
      alert('Booking data missing.');
      return;
    }

    if (form.invalid) {
      alert('Please fill all passenger details before proceeding.');
      return;
    }

    const finalBooking: Booking = {
      ...this.bookingData,
      passengers: this.passengers,
      contact: this.contact,
      totalAmount: this.totalFare,
    };

    this.busService.setCurrentBooking(finalBooking);
    this.router.navigate(['/payment-details']);
  }
}
