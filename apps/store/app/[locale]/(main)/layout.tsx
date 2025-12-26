

import { LanguageSwitcher } from "@repo/ui";
import { ShoppingBag } from "lucide-react";
import { setRequestLocale } from '@repo/i18n';
import { Link } from '@repo/i18n/navigation';
import { Suspense } from "react";
import { UserNavSkeleton } from "@/components/layout/user-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { UserNavFetcher } from "@/components/layout/user-nav-fetcher";
import { CartButton } from "@/components/layout/cart-button";

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
        <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
            <header className="border-b fixed top-0 left-0 right-0 bg-background/95 backdrop-blur z-50 w-full h-16">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
                        <ShoppingBag className="h-6 w-6" />
                        Store
                    </Link>

                    <div className="flex items-center gap-4">
                        <CartButton />

                        <Suspense fallback={<UserNavSkeleton />}>
                            <UserNavFetcher />
                        </Suspense>
                        <Suspense fallback={<div className="w-9 h-9" />}>
                           <LanguageSwitcher variant="store" />
                        </Suspense>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full pt-16">
                {children}
            </main>

                <SiteFooter locale={locale} />
        </div>
    );
}