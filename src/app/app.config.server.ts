import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig as browserConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: []
};

export const appConfig = mergeApplicationConfig(browserConfig, serverConfig);
