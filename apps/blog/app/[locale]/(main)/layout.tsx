import { LanguageSwitcher, UserMenu } from "@repo/ui";
import { BookOpen } from "lucide-react";
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from "react";

export default async function MainLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <>
            {/* Minimal Header */}
            <header className="border-b">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 font-serif text-2xl font-bold">
                        <BookOpen className="h-6 w-6" />
                        The Blog
                    </div>

                    <div className="flex items-center gap-4">
                        <Suspense fallback={<div className="h-9 w-9 rounded-full bg-muted/50 animate-pulse" />}>
                            <UserMenu />
                        </Suspense>
                        <LanguageSwitcher variant="store" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="border-t py-12 mt-12">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-sm text-muted-foreground">
                        © 2024 The Blog. Published with UseVoid.
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium">
                        <a href="#" className="hover:underline">Twitter</a>
                        <a href="#" className="hover:underline">Instagram</a>
                        <a href="#" className="hover:underline">RSS</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
