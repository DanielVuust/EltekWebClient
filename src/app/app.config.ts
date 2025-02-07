import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideStore, StoreModule } from '@ngrx/store';
import { taskListReducer } from './state/task-list-screen/task-list.reducer';
import { taskReducer } from './state/task-screen/task.reducer';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(), 
    provideAnimationsAsync(), 
    provideHttpClient(withFetch()),
    provideStore({ taskList: taskListReducer, task: taskReducer,}),
    provideStoreDevtools({ maxAge: 25, logOnly: false }), 
    provideFirebaseApp(() => 
      initializeApp({ "apiKey": "AIzaSyBVbin0foAm9Rb2qn6KhxZnxdXxkBF80cU", "authDomain": "svendeproeve-71748.firebaseapp.com", "projectId": "svendeproeve-71748", "storageBucket": "svendeproeve-71748.firebasestorage.app", "messagingSenderId": "260985138812", "appId": "1:260985138812:web:16e71901c672811e0a23f9", "measurementId": "G-W62MWQ39DN" })),
    provideAuth(() => getAuth()),
    
  ]
};
