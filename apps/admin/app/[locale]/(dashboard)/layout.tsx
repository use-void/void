import React, { Suspense } from "react";
import { SidebarProvider, SidebarInset } from "@repo/ui";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { localeConfig } from "@repo/i18n";
import { setRequestLocale } from "next-intl/server";
import { UserNav, UserNavSkeleton } from "@/components/layout/user-nav";
import { SiteHeader } from "@/components/layout/site-header";
import { RenderWithUser, RequireAuth } from "@/components/providers/session-provider";
import { routing } from "@repo/i18n/routing"; // تأكد من استيراد إعدادات الراوتينج

// 1. إضافة هذه الدالة في الـ Layout الرئيسي داخل [locale]
// هذا سيغنينا عن تكرارها في كل صفحة فرعية عادية (مثل صفحة Orders)
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    
    // ضروري لتفعيل الـ Static Rendering لهذا الملف
    setRequestLocale(locale);

    const { dir } = localeConfig[locale as keyof typeof localeConfig] || { dir: 'ltr' };
    const side = dir === 'rtl' ? 'right' : 'left';

    return (
        <SidebarProvider>
            <AppSidebar side={side} />
            <SidebarInset className="bg-background min-h-screen flex flex-col transition-all duration-300">
                <SiteHeader
                    userSlot={
                        <Suspense fallback={<UserNavSkeleton />}>
                            <RenderWithUser Component={UserNav} />
                        </Suspense>
                    }
                />

                <Suspense fallback={null}>
                    <RequireAuth>
                        <main className="flex-1 overflow-x-hidden p-6">
                            {children}
                        </main>
                    </RequireAuth>
                </Suspense>
            </SidebarInset>
        </SidebarProvider>
    );
}