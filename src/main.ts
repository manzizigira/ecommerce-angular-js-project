import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import myAppConfig from './app/config/my-app-config';
import { OktaAuth } from '@okta/okta-auth-js';
import { importProvidersFrom } from '@angular/core';
import { AuthInterceptorService } from './app/services/auth-interceptor.service';

const oktaConfig = myAppConfig.oidc;

const oktaAuth = new OktaAuth(oktaConfig);


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    { provide: OKTA_CONFIG, useValue: { oktaAuth } },
    importProvidersFrom(OktaAuthModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }

  ],
}
)
  .catch((err) => console.error(err));
