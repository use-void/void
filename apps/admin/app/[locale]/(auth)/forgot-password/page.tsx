import { setRequestLocale } from "@repo/i18n";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);


    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-background">
            <ForgotPasswordForm />
        </div>
    );
}
