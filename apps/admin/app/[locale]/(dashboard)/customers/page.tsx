import { Suspense } from "react";
import { CustomerList, CustomerListSkeleton } from "@/components/customers/customer-list";
import { getTranslations, setRequestLocale } from "@repo/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.customers" });
    return {
        title: t("title"),
    };
}

export default async function CustomersPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Admin.customers");

    return (
        <div className="flex flex-col h-full w-full space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            </div>
            <Suspense fallback={<CustomerListSkeleton />}>
                <CustomerList />
            </Suspense>
        </div>
    );
}
