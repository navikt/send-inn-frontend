## Tips for debugging

Man kan bruke curlize i en fil som bruker axios for å console logge alle request i forbindelse med utvikling/debugging.

```javascript
import curlirize from 'axios-curlirize';
// initializing axios-curlirize with your axios instance
curlirize(axios);
```

## Login i preprod

Finn en testbruker her og logg deg inn.
https://confluence.adeo.no/pages/viewpage.action?pageId=419521258

Gå til denne siden:
https://send-inn-frontend.dev.nav.no/
Eller:
https://send-inn-frontend-alt.dev.nav.no/

Trykk testid og lim inn syntetisk fødselsnummer i

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

## Run cypress tests

Non-headless/interactive mode:
`npx cypress open`
Headless:
`npx run cypress`

### Se feil tilknyttet denne applikasjonen

https://sentry.gc.nav.no/organizations/nav/projects/send-inn-frontend/

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
8
