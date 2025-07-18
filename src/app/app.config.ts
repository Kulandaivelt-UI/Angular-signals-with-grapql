import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';

import { provideApollo } from 'apollo-angular';
import { InMemoryCache, HttpLink, ApolloClientOptions } from '@apollo/client/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideNativeDateAdapter(),
    provideApollo((): ApolloClientOptions<any> => ({
      cache: new InMemoryCache(),
      link: new HttpLink({ uri: 'http://localhost:4000/graphql' })
    }))

  ]
};