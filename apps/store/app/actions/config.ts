'use server';

import { StoreConfig, connectToDatabase } from "@void/db";

export async function getPaymentConfig() {
    try {
        await connectToDatabase();
        const config = await StoreConfig.findOne({}, { 
            'financials.payment.moyasar.isEnabled': 1,
            'financials.payment.polar.isEnabled': 1,
            'financials.defaultCurrency': 1,
        }).lean();

        return {
            moyasar: {
                isEnabled: config?.financials?.payment?.moyasar?.isEnabled || false,
            },
            polar: {
                isEnabled: config?.financials?.payment?.polar?.isEnabled || false,
            },
            defaultCurrency: config?.financials?.defaultCurrency || 'SAR'
        };
    } catch (error) {
        console.error("❌ Error fetching payment config:", error);
        return {
            moyasar: { isEnabled: false },
            polar: { isEnabled: false }
        };
    }
}
