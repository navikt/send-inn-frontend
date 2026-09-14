/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

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

export default nextConfig;
