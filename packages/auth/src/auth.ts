// packages/auth/src/auth.ts

import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, phoneNumber } from "better-auth/plugins";
import { getDbSync } from "@void/db";
import { ac, roles } from "./permissions";

const db = getDbSync();

export const auth = betterAuth({
    database: mongodbAdapter(db),

    // إعدادات متقدمة لتحسين الأمان (صحيحة وموجودة)
    advanced: {
        ipAddress: { ipAddressHeaders: ["x-forwarded-for", "cf-connecting-ip"] },
    },

    // تسجيل الدخول بالبريد
    emailAndPassword: {
        enabled: true,
    },

    // مدة الجلسة (اختياري، الافتراضي جيد، لكن هذا كود صحيح لو أردت تعديله)
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // update session every 1 day
    },

    plugins: [
        phoneNumber({
            sendOTP: async ({ phoneNumber, code }) => {
                // TODO: Integrate with DB Integration settings later
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

// === تصدير الأنواع بشكل صحيح ===

// 1. استخراج نوع الجلسة بالكامل (يحتوي على user و session)
export type Session = typeof auth.$Infer.Session;

// 2. استخراج نوع المستخدم فقط (مفيد للفرونت إند)
export type User = Session["user"];