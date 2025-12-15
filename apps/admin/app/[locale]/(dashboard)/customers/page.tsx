import { setRequestLocale, getTranslations } from "next-intl/server";
import { CustomersTable } from "@/components/customers";
import { mockCustomersData } from "@/lib/mock-data";

export default async function CustomersPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale); // تفعيل الـ Static Rendering لـ next-intl
    const t = await getTranslations('Admin.customers');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">
                        {t('title')}
                    </h2>
                    <p className="text-zinc-500 font-light">
                        View and manage customers.
                    </p>
                </div>
                {/* عرض البيانات مباشرة - أسرع شيء ممكن */}
                <CustomersTable data={mockCustomersData as any} />
            </div>
        </div>
    );
}