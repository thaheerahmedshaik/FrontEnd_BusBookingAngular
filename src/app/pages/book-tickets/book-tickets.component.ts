import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Bus, BusService, Seat } from '../../bus.service';



@Component({
  selector: 'app-book-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-tickets.component.html',
  styleUrls: ['./book-tickets.component.css']
})
export class BookTicketsComponent implements OnInit {
  private busService = inject(BusService);
  private router = inject(Router);

  @Input() from: string = 'Hyderabad';
  @Input() to: string = 'Bangalore';
  @Input() date: string = '2025-04-12';

  buses: Bus[] = [];
  seats: Seat[] = [];
  selectedBus: Bus | null = null;
  selectedSeats: Seat[] = [];
  totalPrice: number = 0;
  showSeatSelection: boolean = false;

  ngOnInit(): void {
    this.loadBuses();
  }

  loadBuses(): void {
    this.busService.getBuses(this.from, this.to, this.date).subscribe({
      next: (data) => this.buses = data,
      error: (err) => console.error('Error fetching buses:', err)
    });
  }

  openSeatSelection(bus: Bus): void {
    this.selectedBus = bus;
    this.showSeatSelection = true;
    this.busService.getSeats(bus.id).subscribe({
      next: (data: Seat[]) => this.seats = data,
      error: (err: any) => console.error('Error fetching seats:', err)
    });
  }

  closeSeatSelection(): void {
    this.showSeatSelection = false;
    this.selectedSeats = [];
    this.totalPrice = 0;
  }

  getLowerDeckSeats(): Seat[] {
    return this.seats.filter(s => s.deck === 'lower');
  }

  getUpperDeckSeats(): Seat[] {
    return this.seats.filter(s => s.deck === 'upper');
  }

  toggleSeatSelection(seat: Seat): void {
    if (!seat.available) return;

    const index = this.selectedSeats.findIndex(s => s.number === seat.number);
    if (index === -1) {
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats.splice(index, 1);
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalPrice = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.number === seat.number);
  }

  proceedToPayment(): void {
    if (!this.selectedBus || this.selectedSeats.length === 0) return;

    const bookingData = {
      bus: this.selectedBus,
      selectedSeats: this.selectedSeats,
      totalAmount: this.totalPrice,
      from: this.from,
      to: this.to,
      date: this.date
    };

    this.router.navigate(['/payment-details'], { state: { bookingData } });
  }
}
