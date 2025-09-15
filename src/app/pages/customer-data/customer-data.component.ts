import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';

import { Booking, BusBookingService, Passenger } from '../../booking.service';
@Component({
  selector: 'app-customer-data',
  standalone: true,
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatSlideToggleModule
  ]
})
export class CustomerDataComponent {
  contact = { phone: '', email: '', state: '', whatsapp: true };

  states: string[] = ['Telangana', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'Kerala'];

  passengers: any[] = [
    { name: '', age: null, gender: '' }
  ];

  bookingData!: Booking;   // will be filled from router state
  passengers1: Passenger[] = []; // bind from form inputs

  constructor(private router: Router,
private busService: BusBookingService   ) {}

ngOnInit(): void {
  const nav = this.router.getCurrentNavigation();
  if (nav?.extras.state) {
    this.bookingData = nav.extras.state['bookingData'] as Booking;

    // tie each passenger to a selected seat number
    this.passengers = this.bookingData.selectedSeats.map((seat) => ({
      name: '',
      age: 0,
      gender: 'Male',
      seatNumber: seat   // 👈 seat number stored here
    }));
  }
}


  addPassenger() {
    this.passengers.push({ name: '', age: null, gender: '' });
  }

 proceedToPayment(form: any) {
    if (form.valid) {
      const booking = {
        name: this.passengers[0]?.name,
        age: this.passengers[0]?.age,
        phone: this.contact.phone.startsWith('+') ? this.contact.phone : '+91' + this.contact.phone,
        state: this.contact.state
      };

      this.busService.sendBooking(booking).subscribe({
        next: (response: any) => {
          if (response.status === 'success') {
            alert(`Booking details sent! SID: ${response.sid}`);

            // Navigate after successful WhatsApp send
            this.router.navigate(['/payment-details'], {
              state: { passengers: this.passengers, contact: this.contact }
            });
          } else {
            alert(`Error sending booking: ${response.message}`);
          }
        },
        error: (err) => console.error('Error sending WhatsApp:', err)
      });
    }
  }
//   proceedToPayment(form: NgForm) {
//   if (form.invalid) return;

//   const bookingPayload = {
//     contact: this.contact,
//     busName: this.bookingData?.busName,
//     fromCity: this.bookingData?.fromCity,
//     toCity: this.bookingData?.toCity,
//     boardingPoint: this.bookingData?.boardingPoint,
//     droppingPoint: this.bookingData?.droppingPoint,
//     passengers: this.passengers.map(p => ({
//       name: p.name,
//       age: p.age,
//       gender: p.gender,
//       seatNumber: p.seatNumber
//     }))
//   };

//   console.log("Booking payload for WhatsApp:", bookingPayload);

//   this.busService.sendBooking(bookingPayload).subscribe({
//     next: res => console.log("Booking sent successfully", res),
//     error: err => console.error("Error sending booking", err)
//   });
// }


  submitBooking() {
  const finalBooking: Booking = {
    ...this.bookingData,  // bus, seats, boarding, dropping, etc.
    passengers: this.passengers  // collected from user form
  };

  this.busService.sendBooking(finalBooking).subscribe({
    next: res => console.log('✅ Booking sent to WhatsApp', res),
    error: err => console.error('❌ Error sending booking', err)
  });
}

}
