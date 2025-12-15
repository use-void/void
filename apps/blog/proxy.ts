import createMiddleware from 'next-intl/middleware';
import { routing } from '@repo/i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
    return intlMiddleware(request as any);
}

export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(ar|en)/:path*']
};
