// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { KeycloakConfig } from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:9080/auth',
  realm: 'jhipster',
  clientId: 'web_portal',
  credentials: {
    secret: '91288b89-aed5-44ab-9581-08a081c3797c'
  }
};

export const environment = {
  production: false,
  keycloak: keycloakConfig,
  serverApi: {
    url: 'http://localhost:8180/',
  },
  client: {
    baseUrl: 'http://localhost:4200/',
  },
  socketConfig: {
    url: 'http://localhost:3000/',
    opts: {},
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
