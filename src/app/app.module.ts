import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, ApplicationRef } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ROOT_REDUCERS, metaReducers } from 'app/ngrx';
import { RouterEffects } from 'app/ngrx/core/effects';

import { environment } from '../environments/environment';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { vsConfig } from 'app/vs-config';
import { VsSharedModule } from '@vertical/shared.module';
import { VerticalModule } from '@vertical/vertical.module';
import { MainModule } from 'app/main/main.module';
import { CoreModule } from '@vertical/core/core.module';

import { NgrxAuthModule } from 'app/ngrx/auth';
import { NgrxProductsModule } from 'app/ngrx/products';

const keycloakService: KeycloakService = new KeycloakService();

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      // runtimeChecks: {
      //   strictStateImmutability: true,
      //   strictActionImmutability: true,
      //   strictStateSerializability: true,
      //   strictActionSerializability: true,
      // },
    }),
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
    }),
    StoreDevtoolsModule.instrument({
      name: 'NgRx E Commerce App',
      // In a production build you would want to disable the Store Devtools
      // logOnly: environment.production,
    }),
    EffectsModule.forRoot([RouterEffects]),

    MainModule,
    VerticalModule.forRoot(vsConfig),
    VsSharedModule,
    CoreModule,

    NgrxAuthModule,
    NgrxProductsModule,
  ],
  providers: [
    {
      provide: KeycloakService,
      useValue: keycloakService,
    },
  ],
  // bootstrap: [AppComponent]
  entryComponents: [AppComponent],
})
export class AppModule implements DoBootstrap {
  async ngDoBootstrap(appRef: ApplicationRef): Promise<void> {
    const { keycloak } = environment;

    await keycloakService
      .init({
        config: keycloak,
        initOptions: {
          onLoad: 'check-sso',
          checkLoginIframe: false,
          flow: 'implicit',
        },
        enableBearerInterceptor: true,
        bearerExcludedUrls: ['/assets', '/clients/public'],
      })
      .then((auth) => {
        console.log('[ngDoBootstrap] bootstrap app');

        if (auth && !keycloakService.isUserInRole('ROLE_PORTAL')) {
          keycloakService.logout(`${location.origin}/welcome`);
        }

        appRef.bootstrap(AppComponent);
      })
      .catch(error => console.error('[ngDoBootstrap] init Keycloak failed', error));
  }
}
