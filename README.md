# Send inn frontend

Send Inn er en tjeneste som lar en innlogget bruker(ID Porten) opprette eller åpne søknader, laste opp dokumenter/vedlegg, og deretter sende inn søknaden til Nav, ved å bruke [innsending-api](https://github.com/navikt/innsending-api/).

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

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #team-fyllut-sendinn
