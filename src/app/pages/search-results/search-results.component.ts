import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BusService, Bus, Seat } from '../../bus.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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

  boardingPoints = [
    { time: '20:40', name: 'Majestic' },
    { time: '20:55', name: 'Shanthinagar' },
    { time: '21:05', name: 'Dairy Circle' },
    { time: '21:15', name: 'Madiwala' },
  ];

  droppingPoints = [
    { time: '03:30', name: 'Sriperumbudur' },
    { time: '03:45', name: 'Poonamallee' },
    { time: '04:00', name: 'Maduravoyal' },
    { time: '04:40', name: 'Guindy' }
  ];

  selectedBoardingPoint: string | null = null;
  selectedDroppingPoint: string | null = null;

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
        // Remove duplicates by bus.id
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

    this.busService.getSeats(bus.id).subscribe({
      next: (data) => this.seats = data,
      error: (err) => console.error('Error fetching seats:', err)
    });
  }

  closeSeatSelection(): void {
    this.showSeatSelectionModal = false;
    this.selectedSeats = [];
    this.totalPrice = 0;
    this.seats = [];
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

  getSelectedSeatsList(): string {
    return this.selectedSeats.map(s => s.number).join(', ') || 'None';
  }

  proceedToPayment(): void {
    if (!this.selectedBus || this.selectedSeats.length === 0) return;

    const bookingData = {
      bus: this.selectedBus,
      selectedSeats: this.selectedSeats,
      totalAmount: this.totalPrice,
      from: this.from,
      to: this.to,
      date: this.date,
      boardingPoint: this.selectedBoardingPoint,
      droppingPoint: this.selectedDroppingPoint
    };

    this.router.navigate(['/customer-data'], { state: { bookingData } });
  }
}
