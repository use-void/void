import createNextIntlPlugin from '@repo/i18n/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/i18n', '@repo/ui'],
    cacheComponents: true
};

export default withNextIntl(nextConfig);