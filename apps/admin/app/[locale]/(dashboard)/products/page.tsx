import { Button } from "@repo/ui";
import { Plus } from "lucide-react";
import { Link } from "@repo/i18n/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ProductsTable } from "@/components/products/products-table";
import { mockProductsData } from "@/lib/mock-data";

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.products');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-light tracking-tight text-foreground">
                            {t('title')}
                        </h2>
                        <p className="text-muted-foreground font-light">
                            {t('description')}
                        </p>
                    </div>
                    <Link href="/products/create">
                        <Button size="sm">
                            {t('add')}
                            <Plus className="h-4 w-4 mr-2" />
                        </Button>
                    </Link>
                </div>

                <ProductsTable data={mockProductsData} />
            </div>
        </div>
    );
}