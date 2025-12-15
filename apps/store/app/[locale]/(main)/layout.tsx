import { LanguageSwitcher, UserMenu } from "@repo/ui";
import { ShoppingBag } from "lucide-react";
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from "react"; // استيراد Suspense

export default async function MainLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <>
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <ShoppingBag className="h-6 w-6" />
                        Store
                    </div>

                    <div className="flex items-center gap-4">
                        {/* 
                            هنا الحل الذكي الثاني: 
                            Suspense يقوم بفصل عملية جلب بيانات المستخدم عن رسم الصفحة.
                            النتيجة: الهيدر يظهر فوراً ولا ينتظر قاعدة البيانات.
                        */}
                        <Suspense fallback={<div className="h-9 w-9 rounded-full bg-muted/50 animate-pulse" />}>
                            <UserMenu />
                        </Suspense>

                        <LanguageSwitcher variant="store" />
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            {/* Footer code ... */}
            <footer className="bg-muted/50 border-t py-12 mt-12">
                {/* ... */}
            </footer>
        </>
    );
}