import { Routes } from '@angular/router'; 

import { SearchComponent } from './components/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'search', component: SearchComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'bookFlight', component: BookingFormComponent },
  { path: 'confirmation/:id', component: ConfirmationComponent },
  { path: '**', redirectTo: '' }
];