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

  // SEARCH DATA
  from = '';
  to = '';
  date = '';

  // BUS DATA
  buses: Bus[] = [];
  selectedBus: Bus | null = null;

  // SEATS
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  totalPrice = 0;

  showSeatSelectionModal = false;
  loading = false;

  // POINTS
  boardingPoints: BusPoint[] = [];
  droppingPoints: BusPoint[] = [];

  selectedBoardingPoint: BusPoint | null = null;
  selectedDroppingPoint: BusPoint | null = null;

  // FILTERS (FIXED TYPES)
  seatTypeFilter = '';
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities: string[] = [];

  // STATE FLAG
  isFiltered = false;

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

      // reset filter state on new search
      this.isFiltered = false;

      if (this.from && this.to && this.date) {
        this.fetchBuses();
      }
    });
  }

  // 🔹 FETCH ALL BUSES
  fetchBuses(): void {

    if (this.isFiltered) return;

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

  // 🔹 OPEN SEATS
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

    this.busService.getSeats(bus.id).subscribe({
      next: (data) => this.seats = data,
      error: (err) => console.error(err)
    });

    this.busService.getBoardingPoints(bus.id).subscribe({
      next: (data) => {
        this.boardingPoints = data;
        if (data.length > 0) this.selectedBoardingPoint = data[0];
      },
      error: (err) => console.error(err)
    });

    this.busService.getDroppingPoints(bus.id).subscribe({
      next: (data) => {
        this.droppingPoints = data;
        if (data.length > 0) this.selectedDroppingPoint = data[0];
      },
      error: (err) => console.error(err)
    });
  }

  closeSeatSelection(): void {
    this.showSeatSelectionModal = false;
    this.selectedSeats = [];
    this.totalPrice = 0;
  }

  toggleSeatSelection(seat: Seat): void {

    if (!seat.available) return;

    const index = this.selectedSeats.findIndex(s => s.number === seat.number);

    if (index === -1) {
      this.selectedSeats.push(seat);
    } else {
      this.selectedSeats.splice(index, 1);
    }

    this.totalPrice = this.selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }

  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.number === seat.number);
  }

  // 🔹 FILTER BUSES (FINAL FIXED VERSION)
  applyFilters(): void {

    console.log("🚀 applyFilters triggered");

    const params: any = {
      from: this.from,
      to: this.to,
      date: this.date
    };

    if (this.seatTypeFilter) {
      params.seatType = this.seatTypeFilter;
    }

    if (this.minPrice != null) {
      params.minPrice = this.minPrice;
    }

    if (this.maxPrice != null) {
      params.maxPrice = this.maxPrice;
    }

    if (this.minRating != null) {
      params.minRating = this.minRating;
    }

    if (this.amenities?.length > 0) {
      params.amenities = this.amenities.join(',');
    }

    console.log("📦 FILTER PARAMS:", params);

    this.loading = true;

    this.busService.filterBuses(params).subscribe({
      next: (data) => {

        console.log("✅ FILTER RESPONSE:", data);

        this.isFiltered = true;

        this.buses = [...(data || [])];

        this.loading = false;
      },
      error: (err) => {

        console.error("❌ FILTER ERROR:", err);

        this.buses = [];
        this.loading = false;
      }
    });
  }

  // 🔹 PAYMENT
  proceedToPayment(): void {

    if (!this.selectedBus || this.selectedSeats.length === 0) {
      alert('Please select bus and seats');
      return;
    }

    if (!this.selectedBoardingPoint || !this.selectedDroppingPoint) {
      alert('Select boarding and dropping points');
      return;
    }

    const bookingData = {
      busId: this.selectedBus.id,
      busName: this.selectedBus.busName,
      duration: this.selectedBus.duration,
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

    this.router.navigate(['/customer-data'], {
      state: { bookingData }
    });
  }
}