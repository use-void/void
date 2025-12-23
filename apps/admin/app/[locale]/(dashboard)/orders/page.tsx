import { OrderTable } from "@/components/orders/order-table";
import { OrderPageHeader } from "@/components/orders/order-page-header";
import { getTranslations, setRequestLocale } from "@repo/i18n";

// Mock data for orders
const MOCK_ORDERS = [
  {
    id: "ORD-7721",
    customer: {
      name: "أحمد محمد",
      email: "ahmed@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256"
    },
    date: "23 ديسمبر 2025",
    total: "1,550",
    status: "مكتمل",
    paymentStatus: "مدفوع"
  },
  {
    id: "ORD-8842",
    customer: {
      name: "سارة خالد",
      email: "sara@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256"
    },
    date: "22 ديسمبر 2025",
    total: "890",
    status: "قيد المعالجة",
    paymentStatus: "مدفوع"
  },
  {
    id: "ORD-9915",
    customer: {
      name: "فيصل العتيبي",
      email: "faisal@example.com"
    },
    date: "21 ديسمبر 2025",
    total: "2,100",
    status: "قيد الانتظار",
    paymentStatus: "قيد الانتظار"
  },
  {
    id: "ORD-1102",
    customer: {
      name: "نورة القحطاني",
      email: "noura@example.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256"
    },
    date: "20 ديسمبر 2025",
    total: "450",
    status: "ملغي",
    paymentStatus: "ملغي"
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.orders" });
    return {
        title: t("title"),
    };
}

export default async function OrdersPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    
    return (
        <div className="flex flex-col w-full pb-20">
            <OrderPageHeader 
                title="الطلبات" 
                description="إدارة وإدارة طلبات المتجر الخاصة بك" 
            />
            <OrderTable orders={MOCK_ORDERS} />
        </div>
    );
}
