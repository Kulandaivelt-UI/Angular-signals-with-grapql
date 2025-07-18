import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner', 
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  /** When true, shows the overlay + spinner */
  @Input() loading = false;
}
