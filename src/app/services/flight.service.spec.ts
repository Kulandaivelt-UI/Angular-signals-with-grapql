// src/app/services/flight.service.spec.ts
import { SpectatorService, createServiceFactory, SpyObject } from '@ngneat/spectator/jest';
import { FlightService } from './flight.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Flight } from '../models/flight.model';

describe('FlightService', () => {
  let spectator: SpectatorService<FlightService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: FlightService,
    imports: [HttpClientTestingModule],
  });

  const mockFlights: Flight[] = [
    {
      fid: 1,
      airline: 'IndiGo',
      flightNo: '6E-202',
      from: 'Chennai',
      to: 'Delhi',
      price: 5000,
      duration: '2h 30m',
      departureTime: '10:00 AM',
      departureDate: '2025-07-10',
      returnDate: '2025-07-20',
    },
    {
      fid: 2,
      airline: 'Air India',
      flightNo: 'AI-101',
      from: 'Delhi',
      to: 'Mumbai',
      price: 4000,
      duration: '2h 00m',
      departureTime: '06:00 PM',
      departureDate: '2025-07-10',
      returnDate: '2025-07-20',
    },
  ];

  beforeEach(() => {
    spectator = createService();
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should load flights and update allFlights signal', () => {
    spectator.service.loadFlights().subscribe();

    const req = httpMock.expectOne('flights.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockFlights);

    expect(spectator.service.loading()).toBe(false);
    expect(spectator.service.flights()).toEqual(mockFlights);
  });

  it('should filter flights by location and dates via flights computed', () => {
    spectator.service['allFlights'].set(mockFlights);

    // Store search criteria in localStorage
    localStorage.setItem('search', JSON.stringify({
      from: 'Chennai',
      to: 'Delhi',
      departureDate: '2025-07-10',
      roundTrip: true,
      returnDate: '2025-07-20'
    }));

    const filtered = spectator.service.flights();
    expect(filtered.length).toBe(1);
    expect(filtered[0].fid).toBe(1);
  });

  it('should apply airline and time slot filters via flightsn computed', () => {
    spectator.service['allFlights'].set(mockFlights);
    localStorage.setItem('search', JSON.stringify({
      from: '',
      to: '',
      departureDate: '',
      roundTrip: false,
      returnDate: ''
    }));

    spectator.service.setFilters({
      airlines: ['IndiGo'],
      timeSlots: ['Morning (6am–12pm)']
    });

    const result = spectator.service.flightsn();

    expect(result.length).toBe(1);
    expect(result[0].airline).toBe('IndiGo');
  });

  it('should select a flight and update selectedFlight signal', () => {
    spectator.service['allFlights'].set(mockFlights);

    spectator.service.selectFlight(2);
    expect(spectator.service.selectedFlightId()).toBe(2);
    expect(spectator.service.selectedFlight()?.flightNo).toBe('AI-101');
  });

  it('should generate a booking reference id', () => {
    spectator.service.generateBookingRef();
    const ref = spectator.service.bookingRefId();
    expect(ref).toMatch(/^FLREFID-\d{6}$/);
  });

  it('should correctly parse duration strings', () => {
    const minutes = spectator.service['parseDuration']('2h 30m');
    expect(minutes).toBe(150);
  });

  it('should correctly determine if departure time falls in a time slot', () => {
    expect(spectator.service['inTimeSlot']('10:00 AM', 'Morning (6am–12pm)')).toBe(true);
    expect(spectator.service['inTimeSlot']('06:00 PM', 'Evening (6pm–12am)')).toBe(true);
    expect(spectator.service['inTimeSlot']('11:00 PM', 'Night (12am–6am)')).toBe(false);
  });

  it('should calculate correct arrival time', () => {
    const arrival = spectator.service.getArrivalTime('2h 30m', '10:00 AM');
    expect(arrival).toBe('12:30 PM');

    const arrival2 = spectator.service.getArrivalTime('1h 45m', '11:15 PM');
    expect(arrival2).toBe('1:00 AM');
  });
});
