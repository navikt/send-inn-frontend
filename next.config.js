/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  reactStrictMode: false,
  i18n: {
    locales: ['nb', 'en', 'nn'],
    defaultLocale: 'nb',
  },
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  basePath,
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
  return withSentryConfig(nextConfig, sentryWebpackPluginOptions);
};

export default getConfig;
