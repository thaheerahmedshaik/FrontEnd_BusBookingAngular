import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BusService, Booking } from '../../../bus.service'; // Ensure BusService and Booking interface are imported

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css'],
})
export class PaymentDetailsComponent implements OnInit {

  
  paymentForm: FormGroup;
  selectedPaymentMethod: string = '';
  bookingDetails: Booking & { boardingPoint: string; droppingPoint: string } = {
    busName: 'Organe Travels AC sleeper',
    departureTime: '07:00',
    arrivalTime: '23:00',
    duration: '8h 30m',
    selectedSeats: [],
    totalAmount: 2200,
    boardingPoint: '20:40 Majestic - Majestic bus stop back side, in Front of 6',
    droppingPoint: '03:30 Sriperumbudur - Toll Gate',
  };

  
  private bookingData: Booking | null = null;

  setCurrentBooking(data: Booking) {
    this.bookingData = data;
  }

  getCurrentBooking(): Booking | null {
    return this.bookingData;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private busBookingService: BusService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.pattern(/^\d{16}$/)]],
      cardName: [''],
      expiryDate: ['', [Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.pattern(/^\d{3,4}$/)]],
      upiId: ['', [Validators.pattern(/^[\w.-]+@[\w]+$/)]],
    });
  }

  ngOnInit(): void {
    const bookingData = this.busBookingService.getCurrentBooking();
    if (bookingData) {
      this.bookingDetails.busName = bookingData.busName;
      this.bookingDetails.departureTime = bookingData.departureTime;
      this.bookingDetails.arrivalTime = bookingData.arrivalTime;
      this.bookingDetails.duration = bookingData.duration;
      this.bookingDetails.selectedSeats = bookingData.selectedSeats;
      this.bookingDetails.totalAmount = bookingData.totalAmount;
    } else {
      this.router.navigate(['/payment-details']);
    }
  }
  updateBookingDetails(selectedSeats: string[], seatPrice: number, busName: string) {
    this.bookingDetails.busName = busName;
    this.bookingDetails.selectedSeats = selectedSeats.map(seat => ({
      number: seat,
      price: seatPrice
    }));
    this.bookingDetails.totalAmount = this.bookingDetails.selectedSeats
      .reduce((sum, seat) => sum + seat.price, 0);
  }
  
  
  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
    this.paymentForm.reset();

    // Set validators dynamically based on method
    if (method === 'card') {
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.paymentForm.get('cardName')?.setValidators([Validators.required]);
      this.paymentForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
      this.paymentForm.get('upiId')?.clearValidators();
    } else if (method === 'upi') {
      this.paymentForm.get('upiId')?.setValidators([Validators.required, Validators.pattern(/^[\w.-]+@[\w]+$/)]);
      this.paymentForm.get('cardNumber')?.clearValidators();
      this.paymentForm.get('cardName')?.clearValidators();
      this.paymentForm.get('expiryDate')?.clearValidators();
      this.paymentForm.get('cvv')?.clearValidators();
    }

    this.paymentForm.updateValueAndValidity();
  }

  processPayment(): void {
    if (this.selectedPaymentMethod === '') {
      alert('Please select a payment method');
      return;
    }

    if (this.selectedPaymentMethod === 'card' && (
      this.paymentForm.get('cardNumber')?.invalid ||
      this.paymentForm.get('cardName')?.invalid ||
      this.paymentForm.get('expiryDate')?.invalid ||
      this.paymentForm.get('cvv')?.invalid
    )) {
      this.paymentForm.markAllAsTouched();
      alert('Please fill all card details correctly');
      return;
    }

    if (this.selectedPaymentMethod === 'upi' && this.paymentForm.get('upiId')?.invalid) {
      this.paymentForm.get('upiId')?.markAsTouched();
      alert('Please enter a valid UPI ID');
      return;
    }

    console.log('Processing payment via', this.selectedPaymentMethod);
    this.busBookingService.completeBooking();
   alert("payment succesfully"+this.bookingDetails)
    this.router.navigate(['/my-bookings'], {
      state: {
        bookingDetails: this.bookingDetails,
        paymentMethod: this.selectedPaymentMethod,
      },
    });
  }
}
