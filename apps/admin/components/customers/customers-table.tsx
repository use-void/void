"use client";

import { Button } from "@repo/ui";
import { MoreHorizontal, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@repo/i18n/navigation";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuTrigger
} from "@repo/ui";
import { cn } from "@repo/ui";

interface Customer {
    id: string;
    name: string;
    email: string;
    ordersCount: number;
    totalSpent: number;
    joinDate: string;
    status: "active" | "inactive" | "blocked";
}

export function CustomersTable({ data }: { data: Customer[] }) {
    const t = useTranslations("Admin.customers");

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-border rounded-xl bg-card">
                <p>No customers found</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border overflow-hidden bg-card">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-accent border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-medium tracking-wider">Customer</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Joined</th>
                        <th className="px-6 py-4 font-medium tracking-wider text-center">Orders</th>
                        <th className="px-6 py-4 font-medium tracking-wider">Total Spent</th>
                        <th className="px-6 py-4 font-medium tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((customer) => (
                        <tr
                            key={customer.id}
                            className="group hover:bg-muted/30 transition-colors duration-200"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium">
                                        {customer.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{customer.name}</span>
                                        <span className="text-xs text-muted-foreground">{customer.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={cn(
                                    "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
                                    customer.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                        customer.status === 'inactive' ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" :
                                            "bg-destructive/10 text-destructive border-destructive/20"
                                )}>
                                    {customer.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground text-xs">
                                {new Date(customer.joinDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-center font-mono">
                                {customer.ordersCount}
                            </td>
                            <td className="px-6 py-4 font-medium text-foreground">
                                ${customer.totalSpent.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-popover border-border text-muted-foreground">
                                        <DropdownMenuLabel>{t('table.actions')}</DropdownMenuLabel>
                                        <Link href={`/customers/${customer.id}`} className="block w-full">
                                            <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                                                <Eye className="mr-2 h-4 w-4" /> {t('table.viewDetails')}
                                            </DropdownMenuItem>
                                        </Link>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
