import { gql } from 'apollo-angular';

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: BookingInput!) {
    createBooking(input: $input) {
      bookingId
      confirmationStatus
      referenceId
      airline
      flightNo
      from
      to
      departureDate
      departureTime
      returnDate
      roundTrip
      duration
      price
      fullName
      email
      contact
      passengers
      fid
    }
  }
`;
