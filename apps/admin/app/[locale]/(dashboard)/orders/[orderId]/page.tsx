import { setRequestLocale } from "next-intl/server";
import { OrderDetailsView } from "@/components/orders";
import { getOrderById, mockOrdersData } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { routing } from "@repo/i18n/routing";

// 1. هذه الدالة هي المسؤولة عن جعل الصفحة Static
// تقوم Next.js بتشغيلها وقت البناء لإنشاء ملف HTML لكل طلب
export async function generateStaticParams() {
    const params = [];
    
    // نكرر العملية لكل لغة ولكل طلب موجود في الداتا
    for (const order of mockOrdersData) {
        for (const locale of routing.locales) {
            params.push({
                orderId: order.id,
                locale: locale
            });
        }
    }
    
    return params;
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ locale: string; orderId: string }> }) {
    // في Next.js 15+ يجب انتظار الباراميترز حتى في الصفحات الاستاتيكية
    const { locale, orderId } = await params;
    
    // تفعيل الترجمة الاستاتيكية
    setRequestLocale(locale);
    
    const order = getOrderById(orderId);

    if (!order) {
        notFound();
    }

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-light tracking-tight text-white">Order #{orderId}</h2>
                        <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-md font-mono">
                            {order.date.split('T')[0]}
                        </span>
                    </div>
                </div>

                <OrderDetailsView order={order} />
            </div>
        </div>
    );
}