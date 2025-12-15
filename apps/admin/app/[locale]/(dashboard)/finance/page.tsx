import { setRequestLocale, getTranslations } from "next-intl/server";
import { FinanceSummary } from "@/components/finance";

export default async function FinancePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.finance');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">
                        {t('title')}
                    </h2>
                    <p className="text-zinc-500 font-light">
                        Financial overview and reports.
                    </p>
                </div>

                <FinanceSummary />

                <div className="mt-8 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 bg-card">
                    <p>Recent transactions chart placeholder</p>
                </div>
            </div>
        </div>
    );
}
