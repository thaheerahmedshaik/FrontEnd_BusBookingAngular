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
  imports: [CommonModule, FormsModule]
})
export class CustomerDataComponent implements OnInit {
  bookingData!: Booking;
  passengers: Passenger[] = [];
  contact = { phone: '', email: '', state: '', whatsapp: true };
  states = ['Telangana', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Kerala'];

  constructor(private router: Router, private busService: BusBookingService) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state && nav.extras.state['bookingData']) {
      this.bookingData = nav.extras.state['bookingData'];
      this.passengers = this.bookingData.selectedSeats.map(seat => ({
        name: '', age: 0, gender: 'Male', seatNumber: seat.number
      }));
    } else {
      alert('No booking found! Redirecting.');
      this.router.navigate(['/book-tickets']);
    }
  }

  addPassenger() { this.passengers.push({ name: '', age: 0, gender: 'Male', seatNumber: '' }); }

  proceedToPayment(form: NgForm) {
    if (form.invalid) { alert('Fill all passenger details'); return; }

    const finalBooking: Booking = {
      ...this.bookingData,
      passengers: this.passengers,
      contact: this.contact,
      totalAmount: this.bookingData.selectedSeats.reduce((sum, s) => sum + (s.price || 0), 0)
    };

    this.busService.setCurrentBooking(finalBooking);
    this.router.navigate(['/payment-details']);
  }
}
