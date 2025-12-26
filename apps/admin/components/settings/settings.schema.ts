import { z } from "zod";

const LocalizedStringSchema = z.object({
  ar: z.string().min(1, "Required"),
  en: z.string().min(1, "Required"),
});

export const SettingsSchema = z.object({
  name: LocalizedStringSchema,
  slogan: LocalizedStringSchema.optional(),
  description: LocalizedStringSchema,

  assets: z.object({
    logoPrimary: z.string().url().optional().or(z.literal("")),
    logoSecondary: z.string().url().optional().or(z.literal("")),
    favicon: z.string().url().optional().or(z.literal("")),
    ogImageDefault: z.string().url().optional().or(z.literal("")),
  }),

  localization: z.object({
    defaultLanguage: z.string().min(2),
    languages: z.array(z.object({
      code: z.string().min(2),
      name: z.string().min(2),
      isRTL: z.boolean(),
      isActive: z.boolean(),
      flag: z.string().optional(),
    })),
    timezone: z.string().min(1),
  }),

  financials: z.object({
    defaultCurrency: z.string().min(3),
    currencies: z.array(z.object({
      code: z.string().min(3),
      symbol: LocalizedStringSchema,
      exchangeRate: z.number().min(0),
      isActive: z.boolean(),
      decimalPlaces: z.number().min(0).max(4),
    })),
    tax: z.object({
      taxId: z.string().optional().or(z.literal("")),
      isTaxEnabled: z.boolean(),
      isTaxInclusive: z.boolean(),
    })
  }),

  contact: z.object({
    supportEmail: z.string().email().optional().or(z.literal("")),
    supportPhone: z.string().optional().or(z.literal("")),
    whatsappNumber: z.string().optional().or(z.literal("")),
    address: LocalizedStringSchema.optional(),
    socialLinks: z.record(z.string(), z.string()).optional(),
  }),

  shopSettings: z.object({
    isMaintenanceMode: z.boolean(),
    maintenanceMessage: LocalizedStringSchema.optional(),
    isGuestCheckoutEnabled: z.boolean(),
    isInventoryTrackingEnabled: z.boolean(),
    announcementBar: z.object({
      isEnabled: z.boolean(),
      text: LocalizedStringSchema.optional(),
      link: z.string().url().optional().or(z.literal("")),
    })
  }),

  seo: z.object({
    metaTitleTemplate: LocalizedStringSchema,
    metaDescriptionDefault: LocalizedStringSchema,
  }),

  policies: z.object({
    termsAndConditions: LocalizedStringSchema.optional(),
    privacyPolicy: LocalizedStringSchema.optional(),
    refundPolicy: LocalizedStringSchema.optional(),
    shippingPolicy: LocalizedStringSchema.optional(),
  })
});

export type SettingsFormValues = z.infer<typeof SettingsSchema>;
