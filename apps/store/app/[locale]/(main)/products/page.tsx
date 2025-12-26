import { setRequestLocale, getTranslations } from '@repo/i18n';
import { ProductGrid } from '@/components/products/product-grid';
import { routing } from '@repo/i18n/routing';
import { getProducts } from '@/app/actions/catalog';

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ProductsPage({ 
    params
}: { 
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: 'Store' });

    // Fetch initial products statically (Build Time / Cached)
    // We ignore searchParams here to allow full SSG without Suspense
    const products = await getProducts(locale);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight">{t('products.title', { defaultConfig: 'All Products' })}</h1>
                {/* Future: Add Sort/Filters placeholder here */}
            </div>
            
            <ProductGrid locale={locale} products={products} />
        </div>
    );
}
