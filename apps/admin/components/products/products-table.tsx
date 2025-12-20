"use client";

import Image from "next/image";
import { Button } from "@repo/ui";
import { MoreHorizontal, Edit, Trash, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@repo/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui";
import { cn } from "@repo/ui";
import type { SerializedProduct } from "@/lib/actions/product.actions";

export function ProductsTable({ data }: { data: SerializedProduct[] }) {
  const t = useTranslations("Admin.products");

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border border-border bg-card">
        <p>{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-accent border-b border-border">
          <tr>
            <th className="px-6 py-4 font-medium tracking-wider">
              {t("table.product")}
            </th>
            <th className="px-6 py-4 font-medium tracking-wider">
              {t("table.status")}
            </th>
            <th className="px-6 py-4 font-medium tracking-wider">
              {t("table.stock")}
            </th>
            <th className="px-6 py-4 font-medium tracking-wider">
              {t("table.price")}
            </th>
            <th className="px-6 py-4 font-medium tracking-wider text-right">
              {t("table.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((product) => {
            const thumbnailUrl = product.images?.[0]?.url;

            return (
              <tr
                key={product._id} 
                className="group hover:bg-muted/30 transition-colors duration-200"
              >
                {/* Product Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 rounded-lg bg-background border border-border overflow-hidden shrink-0">
                      {thumbnailUrl ? (
                        <Image
                          src={thumbnailUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 font-bold text-xs">
                          IMG
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-foreground group-hover:text-foreground transition-colors">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {product.type}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={product.status} />
                </td>

                {/* Stock */}
                <td className="px-6 py-4 text-muted-foreground font-mono text-xs">
                  {product.type === "digital" 
                    ? "∞" 
                    : (product.physicalDetails?.stock ?? 0)}
                </td>

                {/* Price */}
                <td className="px-6 py-4 font-medium text-foreground">
                  ${Number(product.price).toFixed(2)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    ></DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-popover border-border text-muted-foreground"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>
                          {t("table.actions")}
                        </DropdownMenuLabel>
                        <Link
                          href={`/products/${product._id}`}
                          className="block w-full"
                        >
                          <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                            <Edit className="mr-2 h-4 w-4" /> {t("edit")}
                          </DropdownMenuItem>
                        </Link>
                        <Link
                          href={`/products/${product._id}`}
                          className="block w-full"
                        >
                          <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground">
                            <Eye className="mr-2 h-4 w-4" />{" "}
                            {t("table.viewDetails")}
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash className="mr-2 h-4 w-4" /> {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    draft: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    archived: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const currentStyle = styles[status as keyof typeof styles] || styles.draft;

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-md text-xs font-medium border transition-colors",
        currentStyle
      )}
    >
      {status}
    </span>
  );
}