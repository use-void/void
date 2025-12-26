import { TransactionDetails } from "@/components/finance/transaction-details";
import { setRequestLocale } from "@repo/i18n";

export async function generateMetadata({ params }: { params: Promise<{ transactionId: string }> }) {
    const { transactionId } = await params;
    return {
        title: `Transaction ${transactionId}`,
    };
}

export default async function TransactionDetailsPage({
    params,
}: {
    params: Promise<{ locale: string; transactionId: string }>;
}) {
    const { locale, transactionId } = await params;
    setRequestLocale(locale);
    
    return <TransactionDetails transactionId={transactionId} />;
}
