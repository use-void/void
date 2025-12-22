import { setRequestLocale } from "@repo/i18n";
import { LoginForm } from "@/components/auth/login-form";

export default async function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
            <LoginForm />
        </div>
    );
}
