import {
  Component,
  OnInit,
  signal,
  effect,
  WritableSignal,
  inject,
  runInInjectionContext,
  Injector
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { SharedModule } from '../shared/shared.module';
import {
  BookingFormFields,
  BookingSignals,
  BookingDetails
} from '../../models/flight.model';

import { Apollo } from 'apollo-angular';
import { CREATE_BOOKING } from '../../grapql/booking.mutations';


@Component({
  selector: 'app-booking',
  imports: [SharedModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;

  bookingSignals: BookingSignals = {
    fullName: signal(''),
    email: signal(''),
    contact: signal(''),
    passengers: signal(1)
  };

  // ✅ Get the Angular injector for runInInjectionContext
  private readonly injector = inject(Injector);
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private fs: FlightService,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.bookingForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact: [''],
      passengers: [1, Validators.min(1)]
    });

    runInInjectionContext(this.injector, () => {
      (Object.entries(this.bookingSignals) as [
        keyof BookingFormFields,
        WritableSignal<string>
      ][]).forEach(([key, signalRef]) => {
        const control = this.bookingForm.get(key);
        if (!control) return;

        effect(() => {
          signalRef.set(control.value);
        });
      });
    });
  }

  submit() {
    if (this.bookingForm.valid) {
      this.fs.generateBookingRef();

      const passengerData: BookingFormFields = this.bookingForm.getRawValue();

      const dataPayload: any = {
        referenceId: this.fs.bookingRefId(),
        ...this.fs.selectedFlight(),
        ...passengerData
      };
      this.createBooking(dataPayload);
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }


  createBooking(bookingPayload: any) {
    this.loading = true;

    this.apollo.mutate({
      mutation: CREATE_BOOKING,
      variables: { input: bookingPayload }
    }).subscribe({
      next: res => {
        this.loading = false;
        const bookingData = (res.data as { createBooking: BookingDetails }).createBooking;
        this.router.navigate(['/confirmation', bookingData.bookingId]);
      },
      error: err => {
        this.loading = false;
        this.error = err;

        console.error('Booking failed:', err);
      }
    });

  }

}
