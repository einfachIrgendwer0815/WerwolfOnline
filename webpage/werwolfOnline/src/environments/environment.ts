// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  useHashLocation: false,
  serverName: 'http://localhost:5000',

  homePage: '/',
  playerSettingsRoute: '/play/settings',
  gameRoute: '/game',
  playRoute: '/play',

  api: {
    route: '/api',
    directAccess: false,

    player: {
      route: '/player',
      directAccess: false,

      registrationInformation: {
        route: '/isRegistered',
        directAccess: true,
        requiresJWT: true
      },
      fullRegistration: {
        route: '/fullRegister',
        directAccess: true,
        requiresJWT: true
      }
    },
    token: {
      route: '/token',
      directAccess: false,

      generate: {
        route: '/generate',
        directAccess: true,
        requiresJWT: false
      },
      identityInformation: {
        route: '/getIdentity',
        directAccess: true,
        requiresJWT: true
      }
    },
    room: {
      route: '/room',
      directAccess: false,

      info: {
        route: '/info',
        directAccess: true,
        requiresJWT: true
      },

      publics: {
        route: '/publics',
        directAccess: true,
        requiresJWT: false
      },

      join: {
        route: '/join',
        directAccess: true,
        requiresJWT: true
      },

      leave: {
        route: '/leave',
        directAccess: true,
        requiresJWT: true
      },

      doesRoomExist: {
        route: '/doesRoomExist',
        directAccess: true,
        requiresJWT: false
      }
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
