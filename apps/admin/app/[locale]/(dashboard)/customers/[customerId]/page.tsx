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
        <div className="flex flex-col w-full min-h-screen">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="flex items-center justify-between h-16 w-full px-6 text-start">
                    <div className="flex items-center gap-4">
                        <Link href="/customers">
                            <Button variant="ghost" size="icon" className="h-9 w-9">
                                <Undo2 className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
                    </div>
                </div>
            </div>

            <div className="w-full p-10">
                <Suspense fallback={<CustomerDetailsSkeleton />}>
                    <CustomerDetails customerId={customerId} />
                </Suspense>
            </div>
        </div>
    );
}
