import { Suspense } from "react";
import { CustomerDetails, CustomerDetailsSkeleton } from "@/components/customers/customer-details";
import { getTranslations, setRequestLocale } from "@repo/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; customerId: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.customers.details" });
    return {
        title: t("title"),
    };
}

export default async function CustomerDetailsPage({
    params,
}: {
    params: Promise<{ locale: string; customerId: string }>;
}) {
    const { locale, customerId } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Admin.customers.details");

    return (
        <div className="flex flex-col h-full w-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            </div>
            <Suspense fallback={<CustomerDetailsSkeleton />}>
                <CustomerDetails customerId={customerId} />
            </Suspense>
        </div>
    );
}
