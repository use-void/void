// packages/auth/src/server.ts
import "server-only"; // هذا يضمن عدم استخدامه في الكلاينت بالخطأ
export { auth } from "./auth";
export * from "./auth"; // تصدير الأنواع أيضاً للسيرفر إذا لزم