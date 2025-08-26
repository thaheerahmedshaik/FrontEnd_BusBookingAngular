import { Pipe, PipeTransform } from '@angular/core';
import { Seat } from '../bus.service';
 // adjust path to your Seat interface

@Pipe({
  name: 'seatFilter',
  standalone: true // Angular 15+ standalone pipe
})
export class SeatFilterPipe implements PipeTransform {
  transform(seats: Seat[], deck: string): Seat[] {
    if (!seats || !deck) return seats;
    return seats.filter(seat => seat.deck === deck);
  }
}
