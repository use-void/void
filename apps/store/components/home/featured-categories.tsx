import { getTranslations } from "@repo/i18n";
import { Link } from "@repo/i18n/navigation";
import { Card, CardContent } from "@repo/ui";
import { getFeaturedCategories } from "@/app/actions/catalog";

export async function FeaturedCategories({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "Store.home" });
    
    const categories = await getFeaturedCategories(locale);

    return (
        <section className="py-12 w-full">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-2xl font-bold tracking-tight mb-8">
                    {t("featuredCategories")}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/products?category=${category.slug}`}>
                            <Card className="cursor-pointer bg-muted/20 hover:bg-muted/40">
                                <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                                    <span className="text-5xl">{category.icon}</span>
                                    <span className="font-semibold text-lg">{category.name}</span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
