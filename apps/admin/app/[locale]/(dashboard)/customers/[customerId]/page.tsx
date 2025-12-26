import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "@repo/i18n";
import { Button } from "@repo/ui";
import { Undo2 } from "lucide-react";
import { Link } from "@repo/i18n/navigation";
import { CustomerDetails, CustomerDetailsSkeleton } from "@/components/customers/customer-details";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; customerId: string }> }) {
    const { customerId, locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.customers.details" });
    return {
        title: `${t("title")} - ${customerId}`,
    };
}

export default async function CustomerDetailPage({
    params,
}: {
    params: Promise<{ locale: string; customerId: string }>;
}) {
    const { locale, customerId } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Admin.customers.details");

    return (
        <Suspense fallback={<CustomerDetailsSkeleton />}>
            <CustomerDetails customerId={customerId} />
        </Suspense>
    );
}
