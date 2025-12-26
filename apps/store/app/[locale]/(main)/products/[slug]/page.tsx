import { setRequestLocale } from '@repo/i18n';
import { notFound } from "next/navigation";
import { getProductBySlug, getAllProductsSlugs } from "@/app/actions/catalog";
import { ProductGallery } from '@/components/products/product-gallery';
import { ProductInfo } from '@/components/products/product-info';
import { ProductActions } from '@/components/products/product-actions';
import { FeaturedProducts } from '@/components/home/featured-products';

export async function generateStaticParams({ params }: { params: { locale: string } }) {
    const { locale } = params;
    const products = await getAllProductsSlugs(locale);
    
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    
    const product = await getProductBySlug(locale, slug);

    if (!product) {
        notFound();
    }
    
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                <ProductGallery images={product.images} />
                <div className="flex flex-col">
                    <ProductInfo 
                        locale={locale}
                        name={product.name}
                        price={product.price.toString()}
                        description={product.description}
                    />
                    <div className="mt-8">
                         <ProductActions 
                            locale={locale} 
                            product={{
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0] || '/placeholder.png',
                                slug: product.slug,
                                type: product.type as any
                            }}
                         />
                    </div>
                </div>
            </div>
            
            <div className="mt-24 border-t pt-16">
                    <FeaturedProducts locale={locale} />
            </div>
        </div>
    );
}
