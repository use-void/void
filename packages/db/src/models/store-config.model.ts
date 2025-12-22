import mongoose, { Schema, type Model } from "mongoose";

// تعريف الـ Map المتكرر للنصوص المترجمة لتسهيل القراءة
const LocalizedString = {
    type: Map,
    of: String,
    required: true
};

const StoreConfigSchema = new Schema(
    {
        // --- 1. الهوية العالمية (Global Identity) ---
        name: LocalizedString,        // { "en": "My Store", "ar": "متجري" }
        slogan: { type: Map, of: String },
        description: LocalizedString, // وصف المتجر لـ SEO وللمتجر نفسه
        
        assets: {
            logoPrimary: String,
            logoSecondary: String,
            favicon: String,
            ogImageDefault: String, // صورة مشاركة الروابط الافتراضية
        },

        // --- 2. التحكم في اللغات (Language Management) ---
        localization: {
            defaultLanguage: { type: String, default: "en" }, // اللغة الأساسية (أنت قررت أنها الإنجليزية)
            
            // هنا "المخ": المصفوفة التي تسمح للمسؤول بتفعيل/تعطيل اللغات
            languages: [
                {
                    code: { type: String, required: true }, // en, ar, tr
                    name: String,                           // اسم اللغة (English, العربية)
                    isRTL: { type: Boolean, default: false },
                    isActive: { type: Boolean, default: true }, // التبديل (Toggle)
                    flag: String, // أيقونة أو رمز العلم
                }
            ],
            timezone: { type: String, default: "Asia/Riyadh" },
        },

        // --- 3. التحكم في العملات (Currency Management) ---
        financials: {
            defaultCurrency: { type: String, default: "USD" },
            
            // مصفوفة العملات المفعلة من قبل المسؤول
            currencies: [
                {
                    code: { type: String, required: true },    // USD, SAR, EUR
                    symbol: { type: Map, of: String },         // { "en": "$", "ar": "ر.س" } مترجمة أيضاً!
                    exchangeRate: { type: Number, default: 1 },// سعر الصرف مقابل العملة الافتراضية
                    isActive: { type: Boolean, default: true }, // التبديل (Toggle)
                    decimalPlaces: { type: Number, default: 2 },
                }
            ],
            
            // الضرائب (التأسيس للمستقبل)
            tax: {
                taxId: String,               // الرقم الضريبي للمنشأة
                isTaxEnabled: { type: Boolean, default: false },
                isTaxInclusive: { type: Boolean, default: false }, // هل السعر المعروض يشمل الضريبة؟
            }
        },

        // --- 4. نصوص السياسات القانونية (Legal Texts - All Localized) ---
        // هذه خانات طويلة (Long Text / HTML)
        policies: {
            termsAndConditions: { type: Map, of: String },
            privacyPolicy: { type: Map, of: String },
            refundPolicy: { type: Map, of: String },
            shippingPolicy: { type: Map, of: String },
        },

        // --- 5. معلومات التواصل (Contact & Social) ---
        contact: {
            supportEmail: String,
            supportPhone: String,
            whatsappNumber: String,
            address: { type: Map, of: String }, // حتى العنوان قد يكتب بالعربي وبالإنجليزي
            socialLinks: {
                type: Map,
                of: String // { "instagram": "url", "x": "url" }
            }
        },

        // --- 6. إعدادات تجربة المستخدم (UX Settings) ---
        shopSettings: {
            isMaintenanceMode: { type: Boolean, default: false },
            maintenanceMessage: { type: Map, of: String }, // رسالة الصيانة المترجمة
            
            isGuestCheckoutEnabled: { type: Boolean, default: true },
            isInventoryTrackingEnabled: { type: Boolean, default: true },
            
            // رسالة شريط الإعلانات العلوي (مثال: شحن مجاني للطلبات فوق 200)
            announcementBar: {
                isEnabled: { type: Boolean, default: false },
                text: { type: Map, of: String },
                link: String
            }
        },

        // --- 7. إعدادات الـ SEO العامة (Global SEO) ---
        seo: {
            metaTitleTemplate: { type: Map, of: String }, // مثلا: "%s | MyStore"
            metaDescriptionDefault: { type: Map, of: String },
        }
    },
    { 
        timestamps: true,
        // لضمان وجود وثيقة واحدة فقط (أمان إضافي)
        capsule: { max: 1 } 
    }
);

export type StoreConfigType = mongoose.InferSchemaType<typeof StoreConfigSchema>;
export const StoreConfig = (mongoose.models.StoreConfig as Model<StoreConfigType>) || 
                           mongoose.model<StoreConfigType>("StoreConfig", StoreConfigSchema);