import { bootstrapApplication } from '@angular/platform-browser';
import { mergeApplicationConfig } from '@angular/core';  // <-- Correct import location
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

const additionalConfig = {
  providers: [
    // Add any additional providers here if needed
  ]
};

const mergedConfig = mergeApplicationConfig(appConfig, additionalConfig);

bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error(err));