'use server';

import { Category, Product, connectToDatabase } from "@void/db";
import { cacheTag } from "next/cache";

// Helper type for localized string access
type LocalizedString = Map<string, string>;

function getLocalizedValue(map: LocalizedString | undefined | any, locale: string): string {
    if (!map) return '';
    if (map instanceof Map) {
        return map.get(locale) || map.get('en') || '';
    }
    // Handle plain object case if lean() returns POJOs
    return map[locale] || map['en'] || '';
}

export async function getFeaturedCategories(locale: string) {
    'use cache';
    cacheTag('categories');
    try {
        await connectToDatabase();
        const categories = await Category.find({ isActive: true } as any).limit(4).lean();

        return categories.map((category) => {
            const name = getLocalizedValue(category.name, locale);
            const icon = category.slug === 'electronics' ? "📱" :
                         category.slug === 'fashion' ? "👕" :
                         category.slug === 'digital' ? "💾" : "📦";

            return {
                id: category._id.toString(),
                slug: category.slug,
                name,
                icon
            };
        });
    } catch (error) {
        console.error("❌ Error fetching featured categories:", error);
        return [];
    }
}

export async function getFeaturedProducts(locale: string) {
    'use cache';
    cacheTag('featured-products');
    try {
        await connectToDatabase();
        
        const products = await Product.find({ status: 'active' }).limit(4).sort({ createdAt: -1 }).lean();
        
        return products.map((product) => {
            const name = getLocalizedValue(product.name, locale);
            const image = product.images?.[0]?.url || '/placeholder.png';

            return {
                id: product._id.toString(),
                name,
                slug: product.slug,
                price: product.price,
                image,
                type: (product as any).type
            };
        });
    } catch (error) {
        console.error("❌ Error fetching featured products:", error);
        return [];
    }
}

export async function getProducts(locale: string, categorySlug?: string) {
    'use cache';
    cacheTag('products');
    try {
        await connectToDatabase();

        const query: any = { status: 'active' };

        const products = await Product.find(query).sort({ createdAt: -1 }).lean();

        return products.map((product) => {
            const name = getLocalizedValue(product.name, locale);
            const image = product.images?.[0]?.url || '/placeholder.png';

            return {
                id: product._id.toString(),
                name,
                slug: product.slug,
                price: product.price,
                image,
                category: (product as any).category?.toString(),
                type: (product as any).type
            };
        });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return [];
    }
}

export async function getProductBySlug(locale: string, slug: string) {
    'use cache';
    cacheTag(`product-${slug}`);
    try {
        await connectToDatabase();
        const product = await Product.findOne({ slug, status: 'active' }).lean();

        if (!product) return null;

        const name = getLocalizedValue(product.name, locale);
        const description = getLocalizedValue(product.description, locale);
        
        const images = product.images
            ?.map(img => img.url)
            .filter((url): url is string => !!url) || [];

        const stock = (product as any).physicalDetails?.stock ?? (product as any).stock ?? 0;

        return {
            id: product._id.toString(),
            name,
            description,
            price: product.price,
            images,
            slug: product.slug,
            category: (product as any).category?.toString(),
            stock: stock,
            sku: (product as any).physicalDetails?.sku || (product as any).sku || '',
            type: (product as any).type
        };
    } catch (error) {
        console.error("❌ Error fetching product by slug:", error);
        return null;
    }
}

export async function getRelatedProducts(locale: string, categoryId: string | undefined, currentId: string) {
    if (!categoryId) return [];
    
    try {
        await connectToDatabase();
        const products = await Product.find({
            category: categoryId,
            _id: { $ne: currentId },
            status: 'active'
        }).limit(4).lean();

        return products.map((product) => {
            const name = getLocalizedValue(product.name, locale);
            const image = product.images?.[0]?.url || '/placeholder.png';

            return {
                id: product._id.toString(),
                name,
                slug: product.slug,
                price: product.price,
                image,
                type: (product as any).type
            };
        });
    } catch (error) {
        console.error("❌ Error fetching related products:", error);
        return [];
    }
}

export async function getAllProductsSlugs(locale: string) {
    try {
        await connectToDatabase();
        const products = await Product.find({ status: 'active' }).select('slug').lean();
        return products.map((product) => ({
            slug: product.slug,
        }));
    } catch (error) {
        console.error("❌ Error fetching all product slugs:", error);
        return [];
    }
}
