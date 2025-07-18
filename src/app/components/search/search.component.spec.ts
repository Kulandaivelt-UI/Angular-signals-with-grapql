import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResultsComponent } from '../results/results.component';
import { SharedModule } from '../shared/shared.module';

describe('SearchComponent', () => {
  let spectator: Spectator<SearchComponent>;
  const createComponent = createComponentFactory({
    component: SearchComponent,
    imports: [
      FormsModule,
      RouterTestingModule,
      BrowserAnimationsModule,
      MatCardModule,
      MatRadioModule,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
      SharedModule,
      ResultsComponent
    ],
    detectChanges: true,
    shallow: false,
  });

  beforeEach(() => {
    localStorage.clear();
    spectator = createComponent();
  });

  it('should create the component', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should bind "from" input and update signal', () => {
    const fromInput = spectator.query<HTMLInputElement>('input[name="from"]')!;
    spectator.typeInElement('Chennai', fromInput);
    expect(spectator.component.from()).toBe('Chennai');
  });

  it('should bind "to" input and update signal', () => {
    const toInput = spectator.query<HTMLInputElement>('input[name="to"]')!;
    spectator.typeInElement('Delhi', toInput);
    expect(spectator.component.to()).toBe('Delhi');
  });

  it('should toggle roundTrip using radio buttons', () => {
    const roundTripRadio = spectator.queryAll('mat-radio-button')[0];
    spectator.click(roundTripRadio);
    expect(spectator.component.roundTrip()).toBe(true);

    const oneWayRadio = spectator.queryAll('mat-radio-button')[1];
    spectator.click(oneWayRadio);
    expect(spectator.component.roundTrip()).toBe(false);
  });

  it('should display return date field only when roundTrip is true', () => {
    spectator.component.roundTrip.set(false);
    spectator.detectChanges();
    expect(spectator.query('input[name="returnDate"]')).toBeNull();

    spectator.component.roundTrip.set(true);
    spectator.detectChanges();
    expect(spectator.query('input[name="returnDate"]')).toBeTruthy();
  });

  it('should store search params on searchFlights() call', () => {
    spectator.component.from.set('Chennai');
    spectator.component.to.set('Delhi');
    spectator.component.departureDate.set('2025-07-20');
    spectator.component.roundTrip.set(true);
    spectator.component.returnDate.set('2025-07-24');

    spectator.click('button[type="submit"]');

    const search = JSON.parse(localStorage.getItem('search') || '{}');
    expect(search).toEqual({
      from: 'Chennai',
      to: 'Delhi',
      departureDate: '2025-07-20',
      roundTrip: true,
      returnDate: '2025-07-24',
    });

    expect(spectator.component.searchClicked).toBe(true);
  });

  it('should reset all values on reset()', () => {
    spectator.component.from.set('Mumbai');
    spectator.component.to.set('Bangalore');
    spectator.component.departureDate.set('2025-07-22');
    spectator.component.returnDate.set('2025-07-25');
    spectator.component.roundTrip.set(true);
    spectator.component.searchClicked = true;

    spectator.component.reset();

    expect(spectator.component.from()).toBe('');
    expect(spectator.component.to()).toBe('');
    expect(spectator.component.departureDate()).toBe('');
    expect(spectator.component.returnDate()).toBe('');
    expect(spectator.component.roundTrip()).toBe(false);
    expect(spectator.component.searchClicked).toBe(false);
  });
});
