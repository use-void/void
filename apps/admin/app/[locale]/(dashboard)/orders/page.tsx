import { PageHeader } from "@/components/layout/headers/header-page";
import { Filter, FileDown } from "lucide-react";
import { OrderTable } from "@/components/orders/order-table";
import { getTranslations, setRequestLocale } from "@repo/i18n";
import { Button } from "@repo/ui";

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
        <div className="flex flex-col w-full min-h-screen pb-20">
            <PageHeader 
                title="الطلبات" 
                description="إدارة وإدارة طلبات المتجر الخاصة بك" 
                actions={
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
                      <Filter className="h-4 w-4" />
                      <span>تصفية</span>
                    </Button>
                    <Button variant="outline" className="h-11 px-5 border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground gap-2 ">
                      <FileDown className="h-4 w-4" />
                      <span>تصدير</span>
                    </Button>
                  </div>
                }
            />
            <div className="w-full px-6 lg:px-10 py-8">
                <OrderTable orders={MOCK_ORDERS} />
            </div>
        </div>
    );
}
