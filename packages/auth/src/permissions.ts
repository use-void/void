// packages/auth/src/permissions.ts

import { createAccessControl } from "better-auth/plugins/access";

/**
 * تحديد جميع الموارد (Entities) الموجودة في النظام
 * بناءً على هيكلة قاعدة البيانات الجديدة
 */
export const statement = {
    // الموارد الأساسية
    products: ["create", "read", "update", "delete"],
    orders: ["create", "read", "update", "delete", "manage_status"],
    categories: ["create", "read", "update", "delete"],

    // موارد النظام والإعدادات
    settings: ["read", "update"], // إعدادات المتجر
    integrations: ["read", "update", "toggle"], // تفعيل/تعطيل بوابات الدفع

    // إدارة المستخدمين
    users: ["read", "update", "ban", "delete"],

    // المحتوى
    blog: ["create", "read", "update", "delete", "publish"],
} as const;

export const ac = createAccessControl(statement);

// 1. Super Admin: يملك كل الصلاحيات
export const superadmin = ac.newRole({
    products: ["create", "read", "update", "delete"],
    orders: ["create", "read", "update", "delete", "manage_status"],
    categories: ["create", "read", "update", "delete"],
    settings: ["read", "update"],
    integrations: ["read", "update", "toggle"],
    users: ["read", "update", "ban", "delete"],
    blog: ["create", "read", "update", "delete", "publish"],
});

// 2. Admin: مدير متجر (قد لا نسمح له بحذف المستخدمين أو تغيير إعدادات الدفع الحساسة)
export const admin = ac.newRole({
    products: ["create", "read", "delete"],
    orders: ["read", "update", "manage_status"], // لا يحذف الطلبات للحفاظ على السجلات
    categories: ["create", "read", "update", "delete"],
    settings: ["read", "update"],
    users: ["read", "ban"],
    blog: ["create", "read", "update", "publish"],
    integrations: ["read", "toggle"], // يمكنه التفعيل فقط دون رؤية الـ Keys
});

// 3. Editor: محرر للمدونة فقط
export const editor = ac.newRole({
    blog: ["create", "read", "update"], // لا ينشر (Publish) إلا بمواقة (مثلاً)
    products: ["read"],
});

// 4. User: العميل العادي
export const user = ac.newRole({
    products: ["read"],
    blog: ["read"],
    orders: ["create", "read"], // يقرأ طلباته فقط (يتم تصفيتها في الكود لاحقاً)
});

export const roles = { superadmin, admin, editor, user };

export type role = keyof typeof roles;
export type entity = keyof typeof statement;
export type action<E extends entity = entity> = (typeof statement)[E][number];

export function can(r: role, ent: entity, act: action) {
    const map = roles[r]?.statements as Record<string, string[]>;
    return !!map?.[ent]?.includes(act as string);
}