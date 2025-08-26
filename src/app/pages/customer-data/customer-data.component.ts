import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-data',
  standalone: true,
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.css'],
  imports: [
    CommonModule,
    FormsModule,           // ✅ Required for ngModel & ngForm
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class CustomerDataComponent {
  passengers: any[] = [
    { name: '', age: null, gender: '' }
  ];

  constructor(private router: Router) {}

  addPassenger() {
    this.passengers.push({ name: '', age: null, gender: '' });
  }

  proceedToPayment(form: any) {
    if (form.valid) {
      console.log('Passenger Data:', this.passengers);
      this.router.navigate(['/payment-details'], { state: { passengers: this.passengers } });
    }
  }
}
