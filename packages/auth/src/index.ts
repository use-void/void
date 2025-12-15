// packages/auth/src/index.ts

// 1. تصدير الأنواع فقط (import type مهم جداً هنا)
// لاحظ استخدام "export type" لضمان عدم تحميل ملف auth.ts في الرن تايم
export type { Session, User } from "./auth";

// 2. تصدير الصلاحيات (آمنة للكلاينت والسيرفر)
export { can, type role, type entity, type action } from "./permissions";