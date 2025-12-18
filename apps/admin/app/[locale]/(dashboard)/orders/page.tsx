import { setRequestLocale, getTranslations } from "next-intl/server";
import { OrdersTable } from "@/components/orders";
import { mockOrdersData } from "@/lib/mock-data";
import { Button } from "@repo/ui";
import { Plus } from "lucide-react";
import { Link } from "@repo/i18n/navigation";

// لا نحتاج generateStaticParams هنا، ورثناها من الـ Layout
export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    
    // نبقي عليها لتمكين الـ Static Rendering لهذه الصفحة تحديداً
    setRequestLocale(locale);
    
    const t = await getTranslations('Admin.orders');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-light tracking-tight text-white">
                            {t('title')}
                        </h2>
                        {/* يفضل أيضاً استخدام الترجمة للوصف مستقبلاً */}
                        <p className="text-zinc-500 font-light">
                            Manage and track your customer orders here.
                        </p>
                    </div>
                    <Link href="/orders/create">
                        <Button size="sm">
                            Create Order
                            <Plus className="h-4 w-4 ml-2" />
                        </Button>
                    </Link>
                </div>

                <OrdersTable data={mockOrdersData as any} />
            </div>
        </div>
    );
}