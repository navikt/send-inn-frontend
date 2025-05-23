/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/* eslint @typescript-eslint/no-var-requires: "off" */
import { withSentryConfig } from '@sentry/nextjs';

const minSideAnsattUrl = process.env.NEXT_PUBLIC_MIN_SIDE_ANSATT_URL;

const minSideAnsattUrlMappings = {
  preprodAnsatt: minSideAnsattUrl,
  preprodAltAnsatt: minSideAnsattUrl,
  delingslenke: minSideAnsattUrl,
};

const fyllutAnsattUrlMappings = {
  preprodAnsatt: 'https://fyllut-preprod.ansatt.dev.nav.no/fyllut',
  preprodAltAnsatt: 'https://fyllut-preprod-alt.ansatt.dev.nav.no/fyllut',
};

const nextConfig = {
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ['nb', 'en', 'nn'],
    defaultLocale: 'nb',
  },
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  basePath,
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: basePath + (process.env.NEXT_PUBLIC_API_URL || '/api/backend'),
    minSide: {
      urls: {
        ...(process.env.NEXT_PUBLIC_APP_ENV !== 'production' && minSideAnsattUrlMappings),
        default: process.env.NEXT_PUBLIC_MIN_SIDE_URL,
      },
    },
    fyllut: {
      urls: {
        ...(process.env.NEXT_PUBLIC_APP_ENV !== 'production' && fyllutAnsattUrlMappings),
        default: process.env.NEXT_PUBLIC_FYLLUT_URL,
      },
    },
    basePath,
  },
  async redirects() {
    return [
      {
        source: '/redirect/login',
        destination: '/oauth2/login',
        permanent: false,
      },
    ];
  },
};

const sentryConfig = {
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const getConfig = () => {
  if (process.env.DISABLE_SENTRY === 'true') {
    return nextConfig;
  }
  return withSentryConfig({ ...nextConfig, ...sentryConfig }, sentryWebpackPluginOptions);
};

export default getConfig;
