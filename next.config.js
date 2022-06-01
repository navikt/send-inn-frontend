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
