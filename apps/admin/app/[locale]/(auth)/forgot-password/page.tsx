import { setRequestLocale } from "next-intl/server";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    // redirectIfAuthenticated moved to middleware to prevent blocking route

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
            <ForgotPasswordForm />
        </div>
    );
}
