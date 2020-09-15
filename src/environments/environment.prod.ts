import { KeycloakConfig } from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'https://auth.gardilo.com/auth',
  realm: 'jhipster',
  clientId: 'web_portal',
  credentials: {
    secret: '91288b89-aed5-44ab-9581-08a081c3797c'
  }
};

export const environment = {
  production: true,
  keycloak: keycloakConfig,
  serverApi: {
    url: 'https://system.gardilo.com/',
  },
  client: {
    baseUrl: 'https://portal.gardilo.com/',
  },
  socketConfig: {
    url: 'https://system.gardilo.com/',
    opts: {
      transports: ['websocket'],
    },
  },
};
