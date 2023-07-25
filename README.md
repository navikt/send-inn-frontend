# Send inn frontend

Send Inn er en tjeneste lar en innlogget bruker(ID Porten) opprette eller åpne søknader, laste opp dokumenter/vedlegg, og deretter sende inn søknaden til NAV, ved å bruke [innsending-api](https://github.com/navikt/innsending-api/).

Send Inn brukes ved digital innsening for [Fyll Ut](https://github.com/navikt/skjemabygging-formio).

# Komme i gang

## Lokalt utviklingsmiljø

### Opprett EVN-variabler

```bash
cp ./.env.local.example .env.local
```

Eller opprett filen `.env.local` basert på innholdet fra `.env.local.example`.

### Installer node moduler

```bash
npm install
```

Hvis man får 401 ved uthenting av navik pakkene så kan dette skyldes at man må i logge på github via npm.
Passordet man skal bruke er token fra GitHub -> Settings -> Developer settings -> Tokens (classic).
Tokenet må minimum ha rettigheter til read:packages.

```bash
npm login --registry=https://npm.pkg.github.com --auth-type=legacy
```

### Start applikasjonen i utviklingsmodus

```bash
npm run dev
```

Gå til http://localhost:3100/sendinn/dev

### Kjør cypress tester

Applikasjonen må kjøre

med GUI:

```bash
npm run cypress
```

headless:

```bash
npm run cypress:headless
```

## Login i preprod (kever naisdevice)

Finn en testbruker her og logg deg inn.
https://confluence.adeo.no/pages/viewpage.action?pageId=419521258 (krever tilgang)

Gå til denne siden:
https://www.intern.dev.nav.no/sendinn
Eller:
https://www.intern.dev.nav.no/sendinn-alt

Trykk testid og bruk syntetisk fødselsnummer tilknyttet testbrukern

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

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-fyllut-sendinn
