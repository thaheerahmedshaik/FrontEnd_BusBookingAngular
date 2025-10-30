import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BusService, Booking, BookingDTO, Passenger } from '../../bus.service';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent implements OnInit {
  bookingDetails?: Booking;
  selectedPaymentMethod: 'card' | 'upi' | 'phonepay' | 'googlepay' | null = null;
  paymentForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current booking from BusService
    const booking = this.busService.getCurrentBooking();
    if (!booking) {
      alert('No booking found! Redirecting to search page.');
      this.router.navigate(['/book-tickets']);
      return;
    }
    this.bookingDetails = booking;
    this.initForm();
  }

  private initForm(): void {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.pattern(/^\d{16}$/)]],
      cardName: [''],
      expiryDate: ['', [Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.pattern(/^\d{3,4}$/)]],
      upiId: ['', [Validators.pattern(/^[\w.-]+@[\w]+$/)]],
    });
  }

  selectPaymentMethod(method: 'card' | 'upi' | 'phonepay' | 'googlepay'): void {
    this.selectedPaymentMethod = method;
    this.paymentForm.reset();

    if (method === 'card') {
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.paymentForm.get('cardName')?.setValidators([Validators.required]);
      this.paymentForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
      this.paymentForm.get('upiId')?.clearValidators();
    } else if (method === 'upi') {
      this.paymentForm.get('upiId')?.setValidators([Validators.required, Validators.pattern(/^[\w.-]+@[\w]+$/)]);
      ['cardNumber','cardName','expiryDate','cvv'].forEach(f => this.paymentForm.get(f)?.clearValidators());
    } else {
      ['cardNumber','cardName','expiryDate','cvv','upiId'].forEach(f => this.paymentForm.get(f)?.clearValidators());
    }

    this.paymentForm.updateValueAndValidity();
  }

  processPayment(): void {
    if (!this.bookingDetails) return;
    if (!this.selectedPaymentMethod) return alert('Please select a payment method');

    // Validate card or UPI
    if (this.selectedPaymentMethod === 'card' && this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return alert('Please fill all card details correctly');
    }
    if (this.selectedPaymentMethod === 'upi' && this.paymentForm.get('upiId')?.invalid) {
      this.paymentForm.get('upiId')?.markAsTouched();
      return alert('Please enter a valid UPI ID');
    }

    // Prepare BookingDTO for backend
    const dto: BookingDTO = {
      busId: this.bookingDetails.busId,
      seatIds: this.bookingDetails.selectedSeats?.map(s => s.number) || [],
      passengers: this.bookingDetails.passengers?.map((p: Passenger) => ({
        name: p.name || '',
        age: p.age || 0,
        phone: p.phone || this.bookingDetails?.contact?.phone || '',
        state: p.state || this.bookingDetails?.contact?.state || '',
        gender: p.gender || 'Male',
        seatNumber: p.seatNumber
      })) || [],
      boardingPoint: this.bookingDetails.boardingPoint || '',
      droppingPoint: this.bookingDetails.droppingPoint || ''
    };

    this.busService.bookSeat(this.bookingDetails).subscribe({
      next: () => {
        alert('Payment successful! Your booking is confirmed.');
       // this.busService.clearBooking();
        this.router.navigate(['/my-bookings']);
      },
      error: (err) => {
        console.error('Booking failed', err);
        alert('Something went wrong. Please try again.');
      }
    });
  }

  // Safe getter for seat numbers
  get seatNumbers(): string {
    return this.bookingDetails?.selectedSeats?.map(s => s.number).join(', ') || '';
  }

  get totalAmount(): number {
    return this.bookingDetails?.totalAmount || 0;
  }
}
