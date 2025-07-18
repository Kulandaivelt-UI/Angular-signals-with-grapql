import {
    Component,
    Output,
    EventEmitter,
    Input,
    signal,
    effect
} from '@angular/core';
import { flightNames, timeSlots } from '../../../constants/common.constants';
import { SharedModule } from '../shared.module';

import { Flight, FilterParams, SortBy } from '../../../models/flight.model';


@Component({
    selector: 'app-filter-sidebar',
    imports: [SharedModule],
    templateUrl: './filter-sidebar.component.html',
    styleUrl: './filter-sidebar.component.scss'
})
export class FilterSidebarComponent {
    @Input() availableAirlines: string[] = [];
    @Output() filtersChanged = new EventEmitter<{
        airlines: string[];
        timeSlots: string[];
        SortBy: SortBy;
    }>();

    // Signals for reactive state
    selectedAirlines = signal<string[]>([]);
    selectedTimeSlots = signal<string[]>([]);
    selectedSort = signal<any>('price');

    flightNames = flightNames;
    timeSlot: string[] = timeSlots;

    constructor() {
        effect(() => {
            this.filtersChanged.emit({
                airlines: this.selectedAirlines(),
                timeSlots: this.selectedTimeSlots(),
                SortBy: this.selectedSort()
            });
        });
    }

    toggleAirline(airline: string, checked: boolean) {
        const next = checked
            ? [...this.selectedAirlines(), airline]
            : this.selectedAirlines().filter(a => a !== airline);
        this.selectedAirlines.set(next);
    }

    toggleTimeSlot(slot: string, checked: boolean) {
        const next = checked
            ? [...this.selectedTimeSlots(), slot]
            : this.selectedTimeSlots().filter(s => s !== slot);
        this.selectedTimeSlots.set(next);
    }

    updateSort(event: any): void {
        // this.filters.sortBy = event.value;
        this.selectedSort.set(event.target.value);
    }

    trackByValue(index: number, value: string): string {
        return value;
    }
}