import { ProductListContainer } from "@/components/products/product-list-container";
import { getTranslations, setRequestLocale } from "@repo/i18n";

// Mock data to match the design in the image
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "سماعات نويز كانسيلنج برو",
    sku: "AUD-NC-001",
    category: "إلكترونيات",
    price: "1,299",
    stock: 45,
    status: "نشط",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "لوحة مفاتيح ميكانيكية لاسلكية",
    sku: "KB-MECH-WL",
    category: "ملحقات كمبيوتر",
    price: "650",
    stock: 12,
    status: "نشط",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "3",
    name: "ساعة ذكية رياضية",
    sku: "W-SPORT-X",
    category: "أجهزة قابلة للارتداء",
    price: "899",
    stock: 0,
    status: "مؤرشف",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "4",
    name: "كاميرا احترافية 4K",
    sku: "CAM-4K-PRO",
    category: "تصوير",
    price: "5,400",
    stock: 8,
    status: "مسودة",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2070&auto=format&fit=crop"
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.products" });
    return {
        title: t("title"),
    };
}

export default async function ProductsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    
    return (
        <ProductListContainer initialProducts={MOCK_PRODUCTS} />
    );
}
