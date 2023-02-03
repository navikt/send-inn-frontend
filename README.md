# Send inn frontend

## Login i preprod

Finn en testbruker her og logg deg inn.
https://confluence.adeo.no/pages/viewpage.action?pageId=419521258

Gå til denne siden:
https://www.dev.nav.no/sendinn
Eller:
https://www.dev.nav.no/sendinn-alt

Trykk testid og lim inn syntetisk fødselsnummer i

## Utviklingsmiljø

### Oppsett

Opprett filen .env.local basert på innholdet fra .env.local.example.

```bash
npm install
```

Hvis man får 401 ved uthenting av navik pakkene så kan dette skyldes at man må i logge på github via npm.
Passordet man skal bruke er token fra GitHub -> Settings -> Developer settings -> Tokens (classic).
Tokenet må minimum ha rettigheter til read:packages.

```bash
npm login --registry=https://npm.pkg.github.com --auth-type=legacy
```

Start løsningen lokalt på http://localhost:3000/sendinn/dev

```bash
npm run dev
```

### Run cypress tests

Non-headless/interactive mode:
`npx cypress open`
Headless:
`npx run cypress`

### Tips for debugging

Man kan bruke curlize i en fil som bruker axios for å console logge alle request i forbindelse med utvikling/debugging.

```javascript
import curlirize from 'axios-curlirize';
// initializing axios-curlirize with your axios instance
curlirize(axios);
```

## Sentry

### Self hosted av NAV

Vi bruker: https://sentry.gc.nav.no/

### Generer.sentryclirc

Du kan generere en lokal sentry cli fil ved hjelp av denne kommandoen:
npx sentry-cli --url https://sentry.gc.nav.no/ login

Velg `Create New Token` (bruk default settings), hvis du mangler auth token
Etter dette vil du ha en fil: .sentryclirc

TODO: Erstatt user-token i GitHub-actions med organization-token

> [Auth Tokens are tied to the logged in user, meaning they'll stop working if the user leaves the organization! We suggest using internal integrations to create/manage tokens tied to the organization instead.](https://sentry.gc.nav.no/settings/nav/developer-settings/new-internal)

Feil osv er tilgjengelig her:
https://sentry.gc.nav.no/organizations/nav/projects/send-inn-frontend/

### Se feil tilknyttet denne applikasjonen

https://sentry.gc.nav.no/organizations/nav/projects/send-inn-frontend/
