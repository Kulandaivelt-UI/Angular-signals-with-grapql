// src/app/app.component.spec.ts
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterTestingModule, NavComponent], // Import NavComponent and RouterTestingModule
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create the app', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should have title "Flight Booking"', () => {
    expect(spectator.component.title).toBe('Flight Booking');
  });

  it('should render <app-nav> with role navigation', () => {
    const nav = spectator.query('app-nav');
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute('role')).toBe('navigation');
    expect(nav?.getAttribute('aria-label')).toBe('Primary navigation');
  });

  it('should render <router-outlet>', () => {
    const routerOutlet = spectator.query('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
