import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function PayoutsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.finance');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">Payouts</h2>
                    <p className="text-zinc-500 font-light">Manage payouts.</p>
                </div>
                <div className="border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
                    Payouts list will go here.
                </div>
            </div>
        </div>
    );
}
