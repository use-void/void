
import { setRequestLocale } from '@repo/i18n';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedCategories } from '@/components/home/featured-categories';
import { FeaturedProducts } from '@/components/home/featured-products';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col w-full pb-12">
        <HeroSection locale={locale} />
        
            <FeaturedCategories locale={locale} />

            <FeaturedProducts locale={locale} />
    </div>
  );
}
