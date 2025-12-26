import { z } from "zod";

export const createSetupSchema = (t: (key: string) => string) => z.object({
  // --- Step 1: Store Info ---
  storeName: z.string().min(3, t("validation.storeNameMin")),
  storeDescription: z.string().min(10, t("validation.descriptionMin")),
  
  // --- Step 2: Location & Currency ---
  country: z.string().min(2, t("validation.countryRequired")),
  city: z.string().min(2, t("validation.cityRequired")),
  address: z.string().min(5, t("validation.addressRequired")),
  currency: z.string().min(1, t("validation.currencyRequired")), 
  timezone: z.string().min(1, t("validation.timezoneRequired")), 
  
  // --- Step 3: Admin User ---
  firstName: z.string().min(2, t("validation.firstNameRequired")),
  lastName: z.string().min(2, t("validation.lastNameRequired")),
  email: z.string().email(t("validation.emailInvalid")),
  
  // التعامل مع الحقل الاختياري بشكل صحيح للسماح بـ undefined أو string فارغ
  mobile: z.string().optional().or(z.literal("")), 
  
  password: z.string()
    .min(1, t("validation.passwordRequired"))
    .min(8, t("validation.passwordMin")),
  confirmPassword: z.string().min(1, t("validation.confirmPasswordRequired")),
  
  // --- Step 4: Seeding ---
  // التغيير هنا: نجبره أن يكون boolean ولا نعتمد على default الخاص بـ Zod
  // لأننا سنمرر القيمة الافتراضية عبر React Hook Form
  shouldSeed: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t("validation.passwordsDontMatch"),
  path: ["confirmPassword"],
});

export type SetupFormValues = z.infer<ReturnType<typeof createSetupSchema>>;