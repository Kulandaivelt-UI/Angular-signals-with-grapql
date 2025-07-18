# Flight Booking App

A single-page flight booking application built with Angular 19.  
Search for flights, apply filters (airline, departure time), sort results, book your selected flight, and view booking confirmation.

---

## 🚀 Tech Stack

- Angular 19  
- Angular Material (UI components)  
- Angular Signals (reactive state)  
- RxJS (HttpClient)  
- TypeScript, SCSS  

---

## ⚙️ Prerequisites

- Node.js ≥ 18.x  
- npm ≥ 8.x  
- Angular CLI (globally installed)  
  ```bash
  npm install -g @angular/cli


  📥 Installation
- Clone the repo
git clone https://github.com/your-username/flight-booking-app.git
cd flight-booking-app
- Install dependencies
npm install
- Start dev server
ng serve
- Open your browser at http://localhost:4200

🔍 Features
- Search Flights
Enter origin, destination, departure date (and optional return date), then click Search.
- Real-Time Filtering & Sorting
Sidebar filters by airline and departure-time slot. Sort by price or duration.
- Responsive Flight Cards
Displays airline, flight number, route, departure time, duration & price.
- Booking Flow
Fill passenger details in a Material form. Submit to generate a booking reference and view confirmation.
- Confirmation Page
Shows selected flight details, passenger info & booking reference ID.

📁 Folder Structure
src/
 ├─ app/
 │   ├─ components/
 │   │   ├─ search/          # Search form & triggers results
 │   │   ├─ results/         # Search results & filter sidebar
 │   │   ├─ booking/         # Passenger booking form
 │   │   └─ confirmation/    # Booking confirmation page
 │   ├─ services/
 │   │   └─ flight.service.ts
 │   ├─ models/              # TS interfaces
 │   ├─ constants/           # Static lists
 │   └─ shared/              # Shared modules & styles & spinneer  & sidebar & cards
 ├─ assets/
 │   └─ flights.json         # Mock flight data
 └─ environments/            # Env configs


🔧 Configuration
- Reads flight data from assets/flights.json.
- Stores search parameters in localStorage.
- No additional env variables.

🛠️ Scripts
- ng serve — Run dev server on http://localhost:4200
- ng build — Build for production into dist/
- ng test — Run unit tests
- ng lint — Lint code

🤝 Contributing
- Fork the repo
- Create a branch:
git checkout -b feature/YourFeature
- Commit:
git commit -m "Add new feature"
- Push & open a PR
Please follow Angular style guidelines and add tests for new features.

📄 License
This project is licensed under the MIT License.
