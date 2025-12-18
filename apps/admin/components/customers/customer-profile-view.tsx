"use client";

import { cn } from "@repo/ui";
import { Button } from "@repo/ui";
import { ArrowLeft, Edit, Ban, Mail } from "lucide-react";
import { Link } from "@repo/i18n/navigation";
import { formatDateTime } from "@/utilities/formatDateTime";
import { useLocale } from "next-intl";
import { truncateText } from "@/utilities/truncateText";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: string;
  stats: {
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
  };
  recentOrders: any[];
}

export function CustomerProfileView({ customer }: { customer: Customer }) {
  const locale = useLocale();
  const customerBio =
    "Passionate tech enthusiast and early adopter of smart home devices. Always looking for the latest gadgets to improve home automation setup. Frequent traveler and photography hobbyist who enjoys sharing reviews of travel gear and electronics.";
  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Link href="/customers">
          <Button variant="ghost" size="sm" className="pl-0 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <Ban className="h-4 w-4 mr-2" />
            Block Customer
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
        {/* Sidebar Profile Card */}
        <div className="space-y-6">
          <div className="p-8 border border-zinc-800 rounded-xl bg-card flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-zinc-800 mb-6 flex items-center justify-center text-2xl font-bold text-zinc-500">
              {customer.name.slice(0, 2).toUpperCase()}
            </div>
            <h2 className="text-xl font-medium text-white mb-1">
              {customer.name}
            </h2>
            <p className="text-sm text-zinc-500 mb-6">{customer.email}</p>
            <p className="text-sm text-zinc-500 mb-6 max-w-[300px] text-wrap">
              {truncateText(customerBio, 50, {
                wordBoundary: true,
                suffix: "...",
              })}
            </p>

            <div className="flex gap-2 w-full">
              <Button className="flex-1" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          <div className="p-6 border border-zinc-800 rounded-xl bg-card space-y-4">
            <h3 className="font-medium text-white border-b border-zinc-800 pb-2">
              Contact Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-zinc-500 block mb-1">Phone</span>
                <span className="text-zinc-300">
                  {customer.phone || "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Address</span>
                <span className="text-zinc-300 whitespace-pre-line">
                  {customer.address || "No address"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border border-zinc-800 rounded-xl bg-card">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">
                Total Orders
              </span>
              <p className="text-2xl font-bold text-white mt-1">
                {customer.stats.totalOrders}
              </p>
            </div>
            <div className="p-4 border border-zinc-800 rounded-xl bg-card">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">
                Total Spent
              </span>
              <p className="text-2xl font-bold text-white mt-1">
                ${customer.stats.totalSpent.toFixed(2)}
              </p>
            </div>
            <div className="p-4 border border-zinc-800 rounded-xl bg-card">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">
                Avg. Order
              </span>
              <p className="text-2xl font-bold text-white mt-1">
                ${customer.stats.avgOrderValue.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="border border-zinc-800 rounded-xl bg-card overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="font-medium text-white">Recent Orders</h3>
            </div>
            <div className="divide-y divide-zinc-800">
              {customer.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-sm text-blue-400 hover:underline"
                    >
                      #{order.id}
                    </Link>
                    <span className="text-xs text-zinc-500">
                      {formatDateTime(order.date, {
                        locale: locale as "ar" | "en",
                        monthStyle: "long",
                        arabicNumbers: locale === "ar",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span
                      className={cn(
                        "capitalize px-2 py-0.5 rounded text-[10px] font-medium border",
                        order.status === "paid"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}
                    >
                      {order.status}
                    </span>
                    <span className="text-sm font-medium w-16 text-right">
                      ${order.total}
                    </span>
                  </div>
                </div>
              ))}
              {customer.recentOrders.length === 0 && (
                <div className="p-8 text-center text-zinc-500">
                  No orders found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
