import { setRequestLocale, getTranslations } from "next-intl/server";
import { CustomerProfileView } from "@/components/customers";
import { mockCustomersData, getCustomerById } from "@/lib/mock-data";
import { routing } from "@repo/i18n/routing";

// هذا الجزء هو المسؤول عن جعل الصفحة HIT/304
// يقوم بإنشاء نسخة HTML جاهزة لكل عميل بكل لغة أثناء الـ Build
export async function generateStaticParams() {
    const params = [];

    // حلقة تكرار صريحة لضمان شمول كل العملاء وكل اللغات
    for (const customer of mockCustomersData) {
        for (const locale of routing.locales) {
            params.push({
                customerId: customer.id,
                locale: locale
            });
        }
    }

    return params;
}

export default async function CustomerDetailsPage({ params }: { params: Promise<{ locale: string; customerId: string }> }) {
    const { locale, customerId } = await params;

    // 1. تفعيل وضع SSG (Static Site Generation) لهذه الصفحة
    setRequestLocale(locale);

    // 2. جلب البيانات (مباشرة لأنها Mock Data)
    const t = await getTranslations('Admin.customers');
    const customer = getCustomerById(customerId);

    // إذا كان العميل غير موجود في البيانات، نعرض رسالة بسيطة
    // (هذا لن يحدث للصفحات التي تم توليدها في generateStaticParams)
    if (!customer) {
        return <div className="p-6 text-zinc-500">Customer not found</div>;
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    {/* أي محتوى للهيدر */}
                </div>

                <CustomerProfileView customer={customer} />
            </div>
        </div>
    );
}