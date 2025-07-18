import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { BookingDetails } from '../../models/flight.model';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
    bookingDetails!: BookingDetails;
    loading = true;
    error = '';

    constructor(private route: ActivatedRoute, private apollo: Apollo, private router: Router) {
        const bookingId = this.route.snapshot.paramMap.get('id');
        if (bookingId) {
            this.fetchBookingDetails(bookingId);
        } else {
            this.error = 'No booking ID found in route.';
            this.loading = false;
        }
    }

    fetchBookingDetails(id: string) {
        const GET_BOOKING_BY_ID = gql`
      query GetBookingById($id: String!) {
        getBookingById(bookingId: $id) {
          bookingId
          fullName
          email
          airline
          flightNo
          from
          to
          departureDate
          returnDate
          roundTrip
          price
          duration
          contact
          referenceId
          passengers
          confirmationStatus
          fid
          departureTime
        }
      }
    `;

        this.apollo
            .watchQuery<{ getBookingById: BookingDetails }>({
                query: GET_BOOKING_BY_ID,
                variables: { id }
            })
            .valueChanges
            .subscribe({
                next: ({ data }) => {
                    this.bookingDetails = data.getBookingById;
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Error fetching booking details.';
                    this.loading = false;
                    console.error(err);
                }
            });
    }

    backToSearch() {
        this.router.navigate(['/search']);
    }
}