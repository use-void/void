import { setRequestLocale } from "@repo/i18n";
import { RegisterForm } from "@/components/auth/register-form";

export default async function StoreRegisterPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-background py-10">
            <RegisterForm />
        </div>
    );
}
