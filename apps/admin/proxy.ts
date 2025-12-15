import createMiddleware from 'next-intl/middleware';
import { routing } from '@repo/i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match only internationalized pathnames
    // Skip all internal paths (_next, api, assets, etc)
    matcher: ['/', '/(ar|en|fr)/:path*']
};