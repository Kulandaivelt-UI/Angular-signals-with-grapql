// src/app/services/flight.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Flight, FilterParams, SortBy, SearchCriteria } from '../models/flight.model';
import { tap, finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightService {
  /** Currently selected flight ID */
  selectedFlightId = signal<number | null>(null);

  /** Booking reference string */
  bookingRefId = signal<string>('');

  /** Loading indicator for async requests */
  loading = signal(false);

  /** All flights loaded from the JSON data source */
  private allFlights = signal<Flight[]>([]);

  /** Current filters applied for flights */
  private filters = signal<FilterParams>({
    airlines: [],
    timeSlots: [],
    // SortBy: 'price',
  });

  constructor(private http: HttpClient) { }

  /**
   * Loads flight data from a JSON file and updates the allFlights signal.
   * Sets loading indicator during the HTTP request.
   * @returns Observable that completes when flights are loaded
   */
  loadFlights() {
    this.loading.set(true);
    return this.http.get<Flight[]>('flights.json').pipe(
      tap(f => this.allFlights.set(f)),
      finalize(() => this.loading.set(false))
    );
  }

  /**
   * Checks if a flight matches both location and date-based search criteria.
   * @param flight - A flight record
   * @param criteria - User-provided search criteria
   * @returns True if the flight satisfies all conditions
   */
  private matchesSearch(flight: Flight, criteria: SearchCriteria): boolean {
    return this.matchesLocation(flight, criteria) &&
      this.matchesDates(flight, criteria);
  }

  /**
   * Checks whether flight's origin and destination match the user's input.
   * @param flight - A flight record
   * @param criteria - Search criteria including 'from' and 'to'
   * @returns True if location matches
   */
  private matchesLocation(flight: Flight, criteria: SearchCriteria): boolean {
    const fromLc = criteria.from?.toLowerCase();
    const toLc = criteria.to?.toLowerCase();

    const fromMatch = !fromLc || flight.from.toLowerCase().includes(fromLc);
    const toMatch = !toLc || flight.to.toLowerCase().includes(toLc);

    return fromMatch && toMatch;
  }

  /**
   * Checks whether the flight matches the selected departure and return dates.
   * @param flight - A flight record
   * @param criteria - Search criteria including dates
   * @returns True if date matches
   */
  private matchesDates(flight: Flight, criteria: SearchCriteria): boolean {
    const departureDateMatch = !criteria.departureDate || flight.departureDate === criteria.departureDate;
    const returnDateMatch = !criteria.roundTrip || !criteria.returnDate || flight.returnDate === criteria.returnDate;

    return departureDateMatch && returnDateMatch;
  }

  /**
   * Computed: list of flights filtered using criteria stored in localStorage.
   * @returns Filtered array of flights
   */
  flights = computed(() => {
    const raw = localStorage.getItem('search');
    if (!raw) return this.allFlights();

    const criteria = JSON.parse(raw) as SearchCriteria;
    return this.allFlights().filter(flight => this.matchesSearch(flight, criteria));
  });

  /**
   * Computed: filtered list of flights based on airlines, time slots, and sorted.
   * @returns Final list of filtered and sorted flights
   */
  flightsn = computed(() => {
    const flights = this.flights();
    const filters = this.filters();

    const filtered = this.applyFilters(flights, filters);
    return this.sortFlights(filtered, 'price');
  });

  /**
   * Applies airline and time slot filters.
   * @param flights - Flights to filter
   * @param filters - Filter criteria
   * @returns Filtered flight array
   */
  private applyFilters(flights: Flight[], filters: FilterParams): Flight[] {
    return flights.filter(f =>
      this.matchAirline(f, filters.airlines) &&
      this.matchTimeSlot(f, filters.timeSlots)
    );
  }

  /**
   * Checks if a flight matches selected airline(s).
   * @param flight - A flight record
   * @param airlines - Selected airline list
   * @returns True if matches selected airlines
   */
  private matchAirline(flight: Flight, airlines: string[]): boolean {
    return airlines.length === 0 || airlines.includes(flight.airline);
  }

  /**
   * Checks if a flight's departure time matches any of the selected time slots.
   * @param flight - A flight record
   * @param timeSlots - Selected time slot labels
   * @returns True if time slot matches
   */
  private matchTimeSlot(flight: Flight, timeSlots: string[]): boolean {
    return timeSlots.length === 0 || timeSlots.some(slot =>
      this.inTimeSlot(flight.departureTime, slot)
    );
  }

  /**
   * Sorts flights by either price or duration.
   * @param flights - Array of flights to sort
   * @param sortBy - Sorting preference ("price" | "duration")
   * @returns Sorted array of flights
   */
  private sortFlights(flights: Flight[], sortBy: SortBy): Flight[] {
    return [...flights].sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return this.parseDuration(a.duration) - this.parseDuration(b.duration);
    });
  }

  /**
   * Updates the current filters with the provided filter parameters.
   * @param filters - New filter values to apply
   */
  setFilters(filters: FilterParams) {
    this.filters.set(filters);
  }

  /**
   * Parses a flight duration string (e.g. "2h 30m") into total minutes.
   * @param duration - Duration string to parse
   * @returns Total duration in minutes
   */
  private parseDuration(duration: string): number {
    return duration
      .split(' ')
      .reduce((sum, part) => {
        if (part.endsWith('h')) return sum + parseInt(part) * 60;
        if (part.endsWith('m')) return sum + parseInt(part);
        return sum;
      }, 0);
  }

  /**
   * Determines whether a flight's departure time falls within a specified time slot.
   * @param departure - Departure time string (e.g. "10:00 AM")
   * @param slot - Time slot label (e.g. "Morning (6am–12pm)")
   * @returns True if the departure time falls within the time slot
   */
  private inTimeSlot(departure: string, slot: string): boolean {
    const m = departure.match(/^(\d+):\d+\s?(AM|PM)$/i);
    const h = m ? (+m[1] % 12) + (m[2].toUpperCase() === 'PM' ? 12 : 0) : -1;
    const r: Record<string, [number, number]> = {
      'Morning (6am–12pm)': [6, 12],
      'Afternoon (12pm–6pm)': [12, 18],
      'Evening (6pm–12am)': [18, 24],
      'Night (12am–6am)': [0, 6]
    };
    return h >= 0 && h >= r[slot]?.[0] && h < r[slot]?.[1];
  }

  /**
   * Sets the currently selected flight ID.
   * @param id - Flight ID to select
   */
  selectFlight(id: number) {
    this.selectedFlightId.set(id);
  }

  /**
   * Generates a random booking reference ID and sets it.
   * Format: "FLREFID-XXXXXX"
   */
  generateBookingRef() {
    const ref = 'FLREFID-' + Math.floor(100000 + Math.random() * 900000);
    this.bookingRefId.set(ref);
  }

  /**
   * Computed: the flight currently selected based on selectedFlightId.
   * @returns The selected Flight object or null
   */
  selectedFlight = computed(() =>
    this.allFlights().find(f => f.fid === this.selectedFlightId()) ?? null
  );

  /**
   * Calculates the arrival time based on duration and departure time.
   * @param dur - Duration string (e.g. "2h 30m")
   * @param dep - Departure time string (e.g. "10:00 AM")
   * @returns Arrival time string (e.g. "12:30 PM")
   */
  getArrivalTime = (dur: string, dep: string): string => {
    let [h, m, ampm] = dep.match(/\d+|\w+/g)!;
    let [dh, dm] = dur.match(/\d+/g)!.map(Number);
    h = ((+h % 12) + (ampm === "PM" ? 12 : 0)).toString();
    const min = (+h * 60 + +m + dh * 60 + dm) % 1440;
    const ah = (Math.floor(min / 60) % 12) || 12;
    const ap = min >= 720 ? "PM" : "AM";
    return `${ah}:${(min % 60).toString().padStart(2, "0")} ${ap}`;
  };
}