/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from '@angular/fire/app';
import { environment } from './app/config/appsettings';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
  const app = initializeApp(environment.firebaseConfig);