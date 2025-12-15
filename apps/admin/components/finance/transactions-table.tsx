"use client";

import { useTranslations } from "next-intl";
import { cn } from "@repo/ui";

interface Transaction {
    id: string;
    amount: number;
    type: "payment" | "refund" | "payout";
    status: "succeeded" | "failed" | "pending";
    date: string;
    description: string;
}

export function TransactionsTable({ data }: { data: Transaction[] }) {
    // const t = useTranslations("Admin.finance"); 

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-border rounded-xl bg-card">
                <p>No transactions found</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border overflow-hidden bg-card">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-accent border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-medium tracking-wider">Transaction ID</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Description</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Type</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Date</th>
                        <th className="px-6 py-4 font-medium tracking-wider text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((tx) => (
                        <tr
                            key={tx.id}
                            className="group hover:bg-muted/30 transition-colors duration-200"
                        >
                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                #{tx.id}
                            </td>
                            <td className="px-6 py-4 font-medium text-foreground">
                                {tx.description}
                            </td>
                            <td className="px-6 py-4">
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
                                    tx.type === 'payment' ? "bg-blue-500/10 text-blue-500" :
                                        tx.type === 'refund' ? "bg-amber-500/10 text-amber-500" :
                                            "bg-purple-500/10 text-purple-500"
                                )}>
                                    {tx.type}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={cn(
                                    "flex items-center gap-1.5 text-xs font-medium",
                                    tx.status === 'succeeded' ? "text-emerald-500" :
                                        tx.status === 'failed' ? "text-destructive" :
                                            "text-amber-500"
                                )}>
                                    <span className={cn("w-1.5 h-1.5 rounded-full",
                                        tx.status === 'succeeded' ? "bg-emerald-500" :
                                            tx.status === 'failed' ? "bg-destructive" :
                                                "bg-amber-500"
                                    )} />
                                    {tx.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground text-xs">
                                {new Date(tx.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right font-medium">
                                <span className={tx.type === 'refund' ? "text-foreground" : "text-emerald-500"}>
                                    {tx.type === 'refund' ? '-' : '+'}${tx.amount.toFixed(2)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
