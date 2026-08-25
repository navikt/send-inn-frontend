# Send Inn frontend

This repository contains the Next.js frontend for Send Inn. Authenticated users
can create or resume an application, upload supporting documents, and submit it
through `innsending-api`. FyllUt uses Send Inn for digital submissions.

## Tooling and common commands

- Use the Node.js version pinned in `mise.toml`. Run `mise install`, then prefix
  commands with `mise exec --`.
- Install dependencies with `mise exec -- npm ci`.
- The `@navikt` scope uses GitHub Packages. In a sandbox, configure
  `NODE_AUTH_TOKEN` only in the user npm config while installing, then remove
  it. Never add a token to the repository `.npmrc`.
- Run `mise exec -- npm run lint` for linting.
- Run `mise exec -- npm run build` for a production build.
- Run `mise exec -- npm run dev:mock` for local development with MSW mocks.
  This loads `.env.test` and serves the application under `/sendinn`.

The app uses the Next.js Pages Router. Backend proxy routes live under
`pages/api`, and local API fixtures and MSW handlers live under `mocks`.

## Cypress

Cypress expects the application at `http://localhost:3100/sendinn`, so start the
mock server before running the tests:

```bash
NO_PROXY="${NO_PROXY:+$NO_PROXY,}innsending-api,skjemautfylling" \
no_proxy="${no_proxy:+$no_proxy,}innsending-api,skjemautfylling" \
mise exec -- npm run dev:mock
```

In another shell, run:

```bash
mise exec -- npm run cypress:headless
```

The two `NO_PROXY` entries are required in proxied sandbox environments. MSW
intercepts requests to those mock hostnames. If the proxy handles them first,
it constructs invalid URLs and the UI falls back to error pages, causing many
unrelated Cypress assertions to fail.

Cypress has ten specs under `cypress/e2e` and currently runs fourteen tests.
Use a real application route such as `/sendinn/fyll-ut-default` for readiness
checks because `/sendinn` itself returns 404.

On some mounted sandbox filesystems, npm may fail with `ENOTDIR` while creating
`node_modules`. Installing dependencies on the sandbox-native filesystem and
linking that `node_modules` directory into the repository works for the
development server and Cypress. Do not use that workaround for a standalone
build: Next.js follows the external symlink while tracing files and the build
fails. Remove temporary links and generated artifacts when finished.
