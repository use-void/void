import { z } from "zod";

// --- Schemas ---

const LocalizedStringSchema = z.record(z.string(), z.string().optional().default(""));

const LanguageSchema = z.object({
    code: z.string().min(2),
    name: z.string().optional(),
    isRTL: z.boolean().default(false),
    isActive: z.boolean().default(true),
    flag: z.string().optional(),
});

const CurrencySchema = z.object({
    code: z.string().min(3),
    symbol: LocalizedStringSchema.optional(),
    exchangeRate: z.number().default(1),
    isActive: z.boolean().default(true),
    decimalPlaces: z.number().default(2),
});

export const StoreConfigSchema = z.object({
    // 1. Identity
    name: LocalizedStringSchema,
    slogan: LocalizedStringSchema.optional(),
    description: LocalizedStringSchema,
    assets: z.object({
        logoPrimary: z.string().url().optional().or(z.literal("")),
        logoSecondary: z.string().url().optional().or(z.literal("")),
        favicon: z.string().url().optional().or(z.literal("")),
        ogImageDefault: z.string().url().optional().or(z.literal("")),
    }).optional(),

    // 2. Localization
    localization: z.object({
        defaultLanguage: z.string().default("en"),
        languages: z.array(LanguageSchema).default([]),
        timezone: z.string().default("Asia/Riyadh"),
    }).optional(),

    // 3. Financials
    financials: z.object({
        defaultCurrency: z.string().default("USD"),
        currencies: z.array(CurrencySchema).default([]),
        tax: z.object({
            taxId: z.string().optional(),
            isTaxEnabled: z.boolean().default(false),
            isTaxInclusive: z.boolean().default(false),
        }).optional(),
    }).optional(),

    // 4. Policies
    policies: z.object({
        termsAndConditions: LocalizedStringSchema.optional(),
        privacyPolicy: LocalizedStringSchema.optional(),
        refundPolicy: LocalizedStringSchema.optional(),
        shippingPolicy: LocalizedStringSchema.optional(),
    }).optional(),

    // 5. Contact
    contact: z.object({
        supportEmail: z.string().email().optional().or(z.literal("")),
        supportPhone: z.string().optional(),
        whatsappNumber: z.string().optional(),
        address: LocalizedStringSchema.optional(),
        socialLinks: z.record(z.string(), z.string()).optional(),
    }).optional(),

    // 6. UX Settings
    shopSettings: z.object({
        isMaintenanceMode: z.boolean().default(false),
        maintenanceMessage: LocalizedStringSchema.optional(),
        isGuestCheckoutEnabled: z.boolean().default(true),
        isInventoryTrackingEnabled: z.boolean().default(true),
        announcementBar: z.object({
            isEnabled: z.boolean().default(false),
            text: LocalizedStringSchema.optional(),
            link: z.string().optional(),
        }).optional(),
    }).optional(),

    // 7. SEO
    seo: z.object({
        metaTitleTemplate: LocalizedStringSchema.optional(),
        metaDescriptionDefault: LocalizedStringSchema.optional(),
    }).optional(),
});

export type StoreConfigFormValues = z.infer<typeof StoreConfigSchema>;
