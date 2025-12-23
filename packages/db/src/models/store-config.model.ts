import mongoose, { Schema, type Model } from "mongoose";

const LocalizedString = {
    type: Map,
    of: String,
    required: true
};

const StoreConfigSchema = new Schema(
    {
        isSetupCompleted: { type: Boolean, default: false, index: true },

        name: LocalizedString,
        slogan: { type: Map, of: String },
        description: LocalizedString,
        
        assets: {
            logoPrimary: String,
            logoSecondary: String,
            favicon: String,
            ogImageDefault: String,
        },

        localization: {
            defaultLanguage: { type: String, default: "en" },
            languages: [
                {
                    code: { type: String, required: true },
                    name: String,
                    isRTL: { type: Boolean, default: false },
                    isActive: { type: Boolean, default: true },
                    flag: String,
                }
            ],
            timezone: { type: String, default: "Asia/Riyadh" },
        },

        financials: {
            defaultCurrency: { type: String, default: "USD" },
            currencies: [
                {
                    code: { type: String, required: true },
                    symbol: { type: Map, of: String },
                    exchangeRate: { type: Number, default: 1 },
                    isActive: { type: Boolean, default: true },
                    decimalPlaces: { type: Number, default: 2 },
                }
            ],
            tax: {
                taxId: String,
                isTaxEnabled: { type: Boolean, default: false },
                isTaxInclusive: { type: Boolean, default: false },
            }
        },

        policies: {
            termsAndConditions: { type: Map, of: String },
            privacyPolicy: { type: Map, of: String },
            refundPolicy: { type: Map, of: String },
            shippingPolicy: { type: Map, of: String },
        },

        contact: {
            supportEmail: String,
            supportPhone: String,
            whatsappNumber: String,
            address: { type: Map, of: String },
            socialLinks: { type: Map, of: String }
        },

        shopSettings: {
            isMaintenanceMode: { type: Boolean, default: false },
            maintenanceMessage: { type: Map, of: String }, 
            isGuestCheckoutEnabled: { type: Boolean, default: true },
            isInventoryTrackingEnabled: { type: Boolean, default: true },
            announcementBar: {
                isEnabled: { type: Boolean, default: false },
                text: { type: Map, of: String },
                link: String
            }
        },

        seo: {
            metaTitleTemplate: { type: Map, of: String },
            metaDescriptionDefault: { type: Map, of: String },
        }
    },
    { 
        timestamps: true,
        // ✅ تأكد أن bufferCommands محذوفة من هنا تماماً
        autoCreate: false, 
        capsule: { max: 1 } 
    }
);

export type StoreConfigType = mongoose.InferSchemaType<typeof StoreConfigSchema>;

interface StoreConfigModel extends Model<StoreConfigType> {
    isSystemInitialized(): Promise<boolean>;
}

StoreConfigSchema.statics.isSystemInitialized = async function () {
    const config = await this.findOne({}, { isSetupCompleted: 1 }).lean();
    return !!config?.isSetupCompleted;
};

export const StoreConfig = (mongoose.models.StoreConfig as StoreConfigModel) || 
                           mongoose.model<StoreConfigType, StoreConfigModel>("StoreConfig", StoreConfigSchema);