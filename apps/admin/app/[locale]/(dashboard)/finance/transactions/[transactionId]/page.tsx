import { setRequestLocale, getTranslations } from "next-intl/server";

export function generateStaticParams() {
    return [{ transactionId: 'demo-txn' }];
}

export default async function TransactionDetailsPage({ params }: { params: Promise<{ locale: string; transactionId: string }> }) {
    const { locale, transactionId } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('Admin.finance');

    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6">
                <div className="flex flex-col gap-1 mb-8">
                    <h2 className="text-3xl font-light tracking-tight text-white">Transaction {transactionId}</h2>
                    <p className="text-zinc-500 font-light">Transaction details.</p>
                </div>
                <div className="border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
                    Transaction {transactionId} details will go here.
                </div>
            </div>
        </div>
    );
}