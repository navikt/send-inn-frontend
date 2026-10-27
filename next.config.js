/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const legacyBasePath = process.env.LEGACY_BASE_PATH || '';
const locales = ['nb', 'en', 'nn'];

// Temporary (not permanent) so browsers do not cache it: /sendinn will later be served by another app.
const legacyBasePathRedirects =
  legacyBasePath && legacyBasePath !== basePath
    ? [
        {
          // Next.js adds an internal locale prefix even for paths outside basePath.
          source: `/:legacyLocale(${locales.join('|')})?${legacyBasePath}/:path*`,
          destination: `${basePath}/:path*`,
          basePath: false,
          locale: false,
          permanent: false,
        },
      ]
    : [];

const nextConfig = {
  agentRules: false,
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },
  reactStrictMode: false,
  i18n: {
    locales,
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
      ...legacyBasePathRedirects,
    ];
  },
};

export default nextConfig;
