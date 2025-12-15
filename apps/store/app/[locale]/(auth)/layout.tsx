import { LanguageSwitcher } from "@repo/ui";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full bg-background">
            <div className="absolute top-4 right-4 z-50 md:top-8 md:right-8">
                <LanguageSwitcher variant="store" />
            </div>
            {children}
        </div>
    );
}
