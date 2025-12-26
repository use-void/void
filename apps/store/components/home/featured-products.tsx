import { getTranslations } from "@repo/i18n";
import { Link } from "@repo/i18n/navigation";
import { buttonVariants } from "@repo/ui";
import { ProductCard } from "../products/product-card";
import { getFeaturedProducts } from "@/app/actions/catalog";

export async function FeaturedProducts({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "Store" });

    const products = await getFeaturedProducts(locale);

    return (
        <section className="py-12 w-full">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("home.featuredProducts")}
                    </h2>
                    <Link 
                        href="/products" 
                        className={buttonVariants({ variant: "ghost" })}
                    >
                        {t("common.viewAll")}
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {products.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            locale={locale} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
