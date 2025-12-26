import { ProductCard } from '@/components/products/product-card';
import { getTranslations } from '@repo/i18n';

export async function ProductGrid({
  locale,
  products
}: {
  locale: string;
  products: any[];
}) {
  const t = await getTranslations({ locale, namespace: 'Store' });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {products.length === 0 ? (
            <div className="col-span-full py-24 text-center">
                <p className="text-xl text-muted-foreground">{t('products.noProducts', { default: 'No products found' })}</p>
            </div>
        ) : (
            products.map((product) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    locale={locale} 
                />
            ))
        )}
    </div>
  );
}
