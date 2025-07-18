import { Component, OnInit, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FlightService } from '../../services/flight.service';
import { FilterSidebarComponent } from '../shared/filter-sidebar/filter-sidebar.component';
import { FlightCardComponent } from '../shared/flight-card/flight-card.component';
import { SharedModule } from '../shared/shared.module';
import { SpinnerComponent } from '../shared/spinner/spinner.component'; 
import { FilterParams } from '../../models/flight.model';

@Component({
    selector: 'app-results',
    imports: [SharedModule, RouterModule, FlightCardComponent, FilterSidebarComponent, SpinnerComponent],
    templateUrl: './results.component.html',
    styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
    constructor(public flightService: FlightService, private router: Router) { }

    filteredFlights = computed(() => this.flightService.flightsn());

    ngOnInit() {
        this.flightService.loadFlights().subscribe();
    } 

    applyFilters(filters: FilterParams) {
        this.flightService.setFilters(filters);
    }

    availableAirlines = computed(() =>
        Array.from(new Set(this.flightService.flights().map(f => f.airline)))
    );

    book(fid: number) {
        this.flightService.selectFlight(fid);
        this.router.navigate(['/bookFlight']);
    }
}