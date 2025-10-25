import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BusService, Bus, Seat, BusPoint } from '../../bus.service';
import { SeatFilterPipe } from '../seat-filter.pipe';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SeatFilterPipe],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  providers: [BusService]
})
export class SearchResultsComponent implements OnInit {
  from = '';
  to = '';
  date = '';
  buses: Bus[] = [];
  selectedBus: Bus | null = null;
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  totalPrice = 0;
  showSeatSelectionModal = false;
  loading = false;

  boardingPoints: BusPoint[] = [];
  droppingPoints: BusPoint[] = [];
  
  // Correct typing: objects, not strings
  selectedBoardingPoint: BusPoint | null = null;
  selectedDroppingPoint: BusPoint | null = null;

  constructor(
    private route: ActivatedRoute,
    private busService: BusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.from = params['from'] || '';
      this.to = params['to'] || '';
      this.date = params['date'] || '';
      if (this.from && this.to && this.date) {
        this.fetchBuses();
      }
    });
  }

  fetchBuses(): void {
    this.loading = true;
    this.busService.getBuses(this.from, this.to, this.date).subscribe({
      next: (data) => {
        const unique = new Map<number, Bus>();
        data.forEach(bus => unique.set(bus.id, bus));
        this.buses = Array.from(unique.values());
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching buses:', err);
        this.loading = false;
      }
    });
  }

  openSeatSelection(bus: Bus): void {
    this.selectedBus = bus;
    this.showSeatSelectionModal = true;
    this.selectedSeats = [];
    this.totalPrice = 0;
    this.seats = [];
    this.boardingPoints = [];
    this.droppingPoints = [];
    this.selectedBoardingPoint = null;
    this.selectedDroppingPoint = null;

    // Fetch seats
    this.busService.getSeats(bus.id).subscribe({
      next: (data) => this.seats = data,
      error: (err) => console.error('Error fetching seats:', err)
    });

    // Fetch boarding points
    this.busService.getBoardingPoints(bus.id).subscribe({
      next: (data) => {
        this.boardingPoints = data;
        if (data.length > 0) this.selectedBoardingPoint = data[0];
      },
      error: (err) => console.error('Error fetching boarding points:', err)
    });

    // Fetch dropping points
    this.busService.getDroppingPoints(bus.id).subscribe({
      next: (data) => {
        this.droppingPoints = data;
        if (data.length > 0) this.selectedDroppingPoint = data[0];
      },
      error: (err) => console.error('Error fetching dropping points:', err)
    });
  }

  closeSeatSelection(): void {
    this.showSeatSelectionModal = false;
    this.selectedSeats = [];
    this.totalPrice = 0;
    this.seats = [];
    this.boardingPoints = [];
    this.droppingPoints = [];
    this.selectedBoardingPoint = null;
    this.selectedDroppingPoint = null;
  }

  toggleSeatSelection(seat: Seat): void {
    if (!seat.available) return;

    const index = this.selectedSeats.findIndex(s => s.number === seat.number);
    if (index === -1) this.selectedSeats.push(seat);
    else this.selectedSeats.splice(index, 1);

    this.totalPrice = this.selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }

  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.number === seat.number);
  }

  getSelectedSeatsList(): string {
    return this.selectedSeats.map(s => s.number).join(', ') || 'None';
  }

  proceedToPayment(): void {
    // Validate selections
    if (!this.selectedBus || this.selectedSeats.length === 0) {
        alert('Please select a bus and at least one seat.');
        return;
    }

    if (!this.selectedBoardingPoint || !this.selectedDroppingPoint) {
        alert('Please select both boarding and dropping points.');
        return;
    }

    // Use the objects directly
    const bookingData = {
      busId: this.selectedBus.id,
      busName: this.selectedBus.name,
      fromCity: this.from,
      toCity: this.to,
      travelDate: this.date,
      selectedSeats: this.selectedSeats,
      totalAmount: this.totalPrice,

      boardingPoint: `${this.selectedBoardingPoint.name} (${this.selectedBoardingPoint.time})`,
      droppingPoint: `${this.selectedDroppingPoint.name} (${this.selectedDroppingPoint.time})`,
      boardingPointId: this.selectedBoardingPoint.id,
      droppingPointId: this.selectedDroppingPoint.id
    };

    localStorage.setItem('currentBooking', JSON.stringify(bookingData));
    this.router.navigate(['/customer-data'], { state: { bookingData } });
  }
}
