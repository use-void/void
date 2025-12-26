import { getTranslations } from "@repo/i18n";
import { buttonVariants } from "@repo/ui";
import { Link } from "@repo/i18n/navigation";

export async function HeroSection({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "Store.home" });

    return (
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                            {t("heroTitle")}
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            {t("heroSubtitle")}
                        </p>
                    </div>
                    <div className="flex items-center pt-4">
                        <Link 
                            href="/products" 
                            className={buttonVariants({ size: "lg" })}
                        >
                            {t("shopNow")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
