import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../shared/shared.module'; 
import { ResultsComponent } from '../results/results.component'; 

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SharedModule, ResultsComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'] // fixed plural
})
export class SearchComponent {
  from = signal('');
  to = signal('');
  departureDate = signal('');
  roundTrip = signal(false);    // assuming boolean here
  returnDate = signal('');

  searchClicked = false;

  constructor(private router: Router) {}

  searchFlights() {
    localStorage.removeItem('search');

    const searchParams = {
      from: this.from(),
      to: this.to(),
      departureDate: this.departureDate(),
      roundTrip: this.roundTrip(),
      returnDate: this.returnDate()
    };

    localStorage.setItem('search', JSON.stringify(searchParams));

    this.searchClicked = true; 
  }

  reset() {
    this.from.set('');
    this.to.set('');
    this.departureDate.set('');
    this.roundTrip.set(false);
    this.returnDate.set('');
    this.searchClicked = false;
  }
}
