import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, phoneNumber } from "better-auth/plugins";
import { getMongoDb } from "@void/db"; 
import { ac, roles } from "./permissions";

// بما أننا نستخدم Top-level await، سنضع الكود داخل try-catch لضمان عدم انهيار التطبيق بالكامل إذا فشل الاتصال
// لكن في ملفات التكوين (Config files)، الأفضل ترك الخطأ يظهر ليوقف البناء إذا لم تكن قاعدة البيانات موجودة.

const db = await getMongoDb(); // الآن TypeScript سعيد لأنها ترجع Db مؤكدة

export const auth = betterAuth({
    database: mongodbAdapter(db),
    advanced: {
        ipAddress: { ipAddressHeaders: ["x-forwarded-for", "cf-connecting-ip"] },
    },
    emailAndPassword: { enabled: true },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
    plugins: [
        phoneNumber({
            sendOTP: async ({ phoneNumber, code }) => {
                console.log("OTP", phoneNumber, code);
            },
        }),
        adminPlugin({
            ac,
            roles,
            adminRoles: ["admin", "superadmin"],
            defaultRole: "user",
        }),
        nextCookies(),
    ],
});