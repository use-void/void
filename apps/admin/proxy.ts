import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@repo/i18n/routing";
import { getSessionCookie } from "@void/auth"; 

// ❌ حذفنا استيراد Mongoose و StoreConfig نهائياً من هنا
// import { StoreConfig, connectDB } from "@void/db"; 

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. استثناء الملفات الثابتة
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") || 
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. فحص المصادقة السطحي (عبر الكوكيز فقط - سريع جداً)
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // 3. تحليل المسار
  const segments = pathname.split("/");
  const hasLocale = routing.locales.includes(segments[1] as any);
  const locale = hasLocale ? segments[1] : routing.defaultLocale;
  
  const pathWithoutLocale = hasLocale 
      ? "/" + segments.slice(2).join("/") 
      : pathname;
  const cleanPath = pathWithoutLocale.replace(/\/$/, "") || "/";
  
  const isAuthPage = cleanPath === "/login" || cleanPath === "/forgot-password";
  const isSetupPage = cleanPath.startsWith("/setup");

  // 4. توجيهات المصادقة الأساسية (Authentication Guards)
  
  // إذا كان يحاول دخول صفحات الدخول وهو مسجل -> لوحة التحكم
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // إذا كان يحاول دخول لوحة التحكم وهو غير مسجل -> تسجيل الدخول
  // (نستثني صفحة الإعداد setup لأننا سنفحصها في الـ Layout)
  if (!isAuthPage && !isAuthenticated && !isSetupPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // 5. تسليم الطلب لـ next-intl
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/", 
    "/(ar|en)/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};