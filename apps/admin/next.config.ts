import createNextIntlPlugin from '@repo/i18n/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    cacheComponents: true,
    experimental: {
        authInterrupts: true,
    },
    transpilePackages: ['@repo/i18n', '@repo/ui', '@void/db'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
        ],
    },
};

// استخدام (as any) هنا يجبر التايب سكريبت على قبول الإعدادات وتجاهل الخطأ
export default withNextIntl(nextConfig as any);