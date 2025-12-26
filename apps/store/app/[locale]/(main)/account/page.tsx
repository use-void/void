import { setRequestLocale, getTranslations } from '@repo/i18n';
import { OrderHistory } from '@/components/account/order-history';
import { Avatar, Button, Skeleton } from '@repo/ui';
import { User, LogOut, Settings, Package } from 'lucide-react';
import { getSession } from "@void/auth";
import { redirect } from "next/navigation";
import { Suspense } from 'react';

interface AccountPageProps {
    params: Promise<{ locale: string }>;
}

export default async function AccountPage({ params }: AccountPageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <Suspense fallback={<AccountSkeleton />}>
                <AccountContent locale={locale} />
            </Suspense>
        </div>
    );
}

async function AccountContent({ locale }: { locale: string }) {
    const t = await getTranslations({ locale, namespace: "Store" });
    const session = await getSession();

    if (!session || !session.user) {
        redirect(`/${locale}/login`);
    }

    const { user } = session;
    
    // Robust logic for user initial to fix reported issue
    const userInitial = (user?.name?.trim().charAt(0) || "U").toUpperCase();

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="w-full md:w-64 space-y-2">
                <div className="p-6 bg-muted/20 rounded-2xl mb-6 text-center">
                    <div className="flex justify-center mb-4">
                        <Avatar className="h-20 w-20 border-2 border-background shadow-md">
                            <div className="bg-primary text-primary-foreground h-full w-full flex items-center justify-center text-2xl font-bold">
                                {userInitial}
                            </div>
                        </Avatar>
                    </div>
                    <h2 className="font-bold text-lg">{user.name}</h2>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>

                <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-primary">
                    <Package className="mr-2 h-5 w-5" />
                    {t("account.myOrders")}
                </Button>
                <Button variant="ghost" className="w-full justify-start h-12 rounded-xl">
                    <User className="mr-2 h-5 w-5" />
                    {t("account.profile")}
                </Button>
                <Button variant="ghost" className="w-full justify-start h-12 rounded-xl">
                    <Settings className="mr-2 h-5 w-5" />
                    {t("account.settings")}
                </Button>
                <div className="pt-4 border-t mt-4">
                    <Button variant="ghost" className="w-full justify-start h-12 rounded-xl text-destructive hover:text-destructive">
                        <LogOut className="mr-2 h-5 w-5" />
                        {t("account.logout")}
                    </Button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 bg-background rounded-2xl border p-6 md:p-8 shadow-sm">
                <OrderHistory locale={locale} userId={user.id} />
            </main>
        </div>
    );
}

function AccountSkeleton() {
    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 animate-pulse">
            <aside className="w-full md:w-64 space-y-4">
                <div className="h-48 bg-muted/20 rounded-2xl" />
                <div className="space-y-2">
                    <div className="h-12 bg-muted/20 rounded-xl" />
                    <div className="h-12 bg-muted/20 rounded-xl" />
                    <div className="h-12 bg-muted/20 rounded-xl" />
                </div>
            </aside>
            <main className="flex-1 h-[500px] bg-muted/10 rounded-2xl border" />
        </div>
    );
}
