/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    compiler: {
        styledComponents: true,
    },
    experimental: {
        outputStandalone: true,
    },
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    publicRuntimeConfig: {
        // Will be available on both server and client
        apiUrl:
            (process.env.NEXT_PUBLIC_BASE_PATH || '') +
            (process.env.NEXT_PUBLIC_API_URL || '/api/backend'),
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
