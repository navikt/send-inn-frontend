/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

module.exports = {
    reactStrictMode: true,
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
    experimental: {
        outputStandalone: true,
    },
    basePath,
    publicRuntimeConfig: {
        // Will be available on both server and client
        apiUrl:
            basePath +
            (process.env.NEXT_PUBLIC_API_URL || '/api/backend'),
        basePath,
    },
    async redirects() {
        return [
            {
                source: '/login',
                destination: '/oauth2/login',
                permanent: false,
            },
        ];
    },
};
