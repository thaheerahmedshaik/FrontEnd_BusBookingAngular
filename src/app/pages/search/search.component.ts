import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Offer } from '../../bus.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  bookingForm: FormGroup;
  fromCities: string[] = [];
  toCities: string[] = [];
  offers: Offer[] = [];
  minDate: string = new Date().toISOString().split('T')[0];
  isSwapping = false;
  loggedIn=true;
  

   ngOnInit(): void {
    this.loadFromCities();
    this.loadToCities();
    this.loadOffers(); // ✅ CALL OFFERS
  }

  // ---------- OFFERS ----------
  loadOffers() {
    this.http.get<Offer[]>(`${this.apiUrl}/offers`).subscribe({
      next: data => {
        this.offers = data;
        console.log('Offers loaded:', data);
      },
      error: err => console.error('Error loading offers', err)
    });
  }
trackByOfferId(index: number, offer: any): number {
  return offer.id;
}

// COPY COUPON FUNCTION
copyCoupon(code: string) {
  navigator.clipboard.writeText(code)
    .then(() => {
      alert(`Coupon "${code}" copied to clipboard!`);
    })
    .catch(err => {
      console.error('Failed to copy coupon:', err);
    });
}

  login(){
    this.loggedIn=true;
  }
  logout(){
    this.loggedIn=false;
  }
 
  private apiUrl = 'http://localhost:8080/buses';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.bookingForm = this.fb.group({
      from: [null, Validators.required],
      to: [null, Validators.required],
      journeyDate: ['', Validators.required]
    });

    this.loadFromCities();
    this.loadToCities();
  }

  loadFromCities() {
    this.http.get<string[]>(`${this.apiUrl}/fromCities`).subscribe({
      next: data => this.fromCities = data,
      error: err => console.error('Error loading from cities', err)
    });
  }

  loadToCities() {
    this.http.get<string[]>(`${this.apiUrl}/toCities`).subscribe({
      next: data => this.toCities = data,
      error: err => console.error('Error loading to cities', err)
    });
  }

  swapCities() {
    const fromControl = this.bookingForm.get('from');
    const toControl = this.bookingForm.get('to');

    if (fromControl && toControl) {
      this.isSwapping = true;

      const temp = fromControl.value;
      fromControl.setValue(toControl.value);
      toControl.setValue(temp);

      setTimeout(() => this.isSwapping = false, 100); // reset after swap
    }
  }

  searchBuses() {
    if (this.bookingForm.valid) {
      const queryParams = {
        from: this.bookingForm.value.from,
        to: this.bookingForm.value.to,
        date: this.bookingForm.value.journeyDate
      };
      this.router.navigate(['/search-results'], { queryParams });
    }
  }
}
