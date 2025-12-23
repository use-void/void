import { getRequestConfig } from '@repo/i18n/server';
import { hasLocale } from '@repo/i18n';
import { routing } from '@repo/i18n/routing';

export default getRequestConfig(async function createRequestConfig({
    requestLocale,
}) {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    const sharedMessages = (await import(`@repo/i18n/messages/common/${locale}.json`)).default;
    const localMessages = (await import(`@repo/i18n/messages/admin/${locale}.json`)).default;
    const productMessages = (await import(`@repo/i18n/messages/admin/products/${locale}.json`)).default;

    return {
        locale,
        messages: { ...sharedMessages, ...localMessages, Products: productMessages },
    };
});