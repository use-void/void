import { CustomerTable } from "@/components/customers/customer-table";
import { CustomerPageHeader } from "@/components/customers/customer-page-header";
import { getTranslations, setRequestLocale } from "@repo/i18n";

// Mock data for customers
const MOCK_CUSTOMERS = [
  {
    id: "C-1001",
    name: "علي بن سعود",
    email: "ali@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256",
    totalOrders: 12,
    totalSpent: "4,500",
    lastActive: "منذ ساعتين",
    status: "نشط"
  },
  {
    id: "C-1002",
    name: "ليلى العامري",
    email: "layla@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256",
    totalOrders: 8,
    totalSpent: "2,890",
    lastActive: "منذ يوم",
    status: "نشط"
  },
  {
    id: "C-1003",
    name: "عمر الفاروق",
    email: "omar@example.com",
    totalOrders: 0,
    totalSpent: "0",
    lastActive: "منذ شهر",
    status: "غير نشط"
  },
  {
    id: "C-1004",
    name: "ريم عبدالله",
    email: "reem@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=facearea&facepad=2&w=256&h=256",
    totalOrders: 25,
    totalSpent: "15,200",
    lastActive: "الآن",
    status: "نشط"
  }
];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "Admin.customers" });
    return {
        title: t("title"),
    };
}

export default async function CustomersPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    
    return (
        <div className="flex flex-col w-full pb-20">
            <CustomerPageHeader 
                title="العملاء" 
                description="إدارة قاعدة بيانات العملاء وتتبع نشاطهم" 
            />
            <CustomerTable customers={MOCK_CUSTOMERS} />
        </div>
    );
}
