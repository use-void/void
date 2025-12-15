export const localeConfig = {
    en: {
        label: "English",
        dir: "ltr",
        flag: "🇺🇸"
    },
    ar: {
        label: "العربية",
        dir: "rtl",
        flag: "🇸🇦"
    },
    fr: {
        label: "Français",
        dir: "ltr",
        flag: "🇫🇷"
    }
} as const;

export type Locale = keyof typeof localeConfig;

export const locales = Object.keys(localeConfig) as Locale[];
export const defaultLocale: Locale = 'en';

export function getNextLocale(current: string): Locale {
    const idx = locales.indexOf(current as Locale);
    // If not found, default to first locale
    const currentIndex = idx === -1 ? 0 : idx;
    const nextIndex = (currentIndex + 1) % locales.length;
    return locales[nextIndex] as Locale;
}

export function getLocaleLabel(locale: string): string {
    const l = locale as Locale;
    if (localeConfig[l]) {
        return localeConfig[l].label;
    }
    return locale;
}

export function getLocaleFlag(locale: string): string {
    const l = locale as Locale;
    if (localeConfig[l]) {
        return localeConfig[l].flag;
    }
    return "🌐";
}
