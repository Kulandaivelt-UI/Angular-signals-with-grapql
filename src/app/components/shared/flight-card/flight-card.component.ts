import { Component, Input, signal, computed } from '@angular/core'; 
import { Flight } from '../../../models/flight.model';
import { FlightService } from '../../../services/flight.service';
import { SharedModule } from '../shared.module';
import { Router } from '@angular/router';

@Component({
    selector: 'app-flight-card',
    imports: [SharedModule],
    templateUrl: './flight-card.component.html',
    styleUrl: './flight-card.component.scss'

})
export class FlightCardComponent {

    constructor(public flightService: FlightService,private router: Router) {}

    _flight = signal<Flight>({
        fid: 0,
        airline: '',
        flightNo: '',
        from: '',
        to: '',
        price: 0,
        duration: '',
        departureTime: ''
    });

    @Input() set flight(value: Flight) {
        this._flight.set(value);
    }

}