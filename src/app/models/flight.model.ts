import { WritableSignal } from "@angular/core";

export interface Flight {
  fid?: number;
  airline: string;
  flightNo: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  departureTime: string;
  returnTime?: string;
  departureDate?: string;
  returnDate?: string;
  roundTrip?: boolean;
}

export type SortBy = 'price' | 'duration';

export interface FilterParams {
  airlines: string[];
  timeSlots: string[];
  SortBy?: SortBy;
}

export type BookingFormFields = {
  fullName: string;
  email: string;
  contact: string;
  passengers: number;
};

export type BookingSignals = {
  [K in keyof BookingFormFields]: WritableSignal<BookingFormFields[K]>;
};

export interface passengerDetails {
  fullName: string;
  email: string;
  contact: string;
  passengers: number;
  // Optional: add flight details if needed
  // flightId?: number;
}

export interface SearchCriteria {
  from?: string;
  to?: string;
  departureDate?: string;
  roundTrip?: boolean;
  returnDate?: string;
}

export interface BookingRefId {
  referenceId: string;
}

// export interface BookingDetails extends Flight, passengerDetails, BookingRefId { }

export interface BookingInput {
  fid?: number;
  airline?: string;
  flightNo: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  departureTime: string;
  departureDate: string;
  returnDate?: string;
  roundTrip?: string;
  referenceId: string;
  fullName: string;
  email: string;
  contact: string;
  passengers: number;
}

export interface BookingDetails {
  bookingId: string;
  confirmationStatus: string;
  fid: number;
  airline: string;
  flightNo: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  departureTime: string;
  departureDate: string;
  returnDate: string;
  roundTrip: boolean;
  referenceId: string;
  fullName: string;
  email: string;
  contact: string;
  passengers: number;
}