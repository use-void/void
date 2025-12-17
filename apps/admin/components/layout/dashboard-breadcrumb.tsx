"use client";

import { usePathname } from "@repo/i18n/navigation";
import { Link } from "@repo/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui";
import React from "react";

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const t = useTranslations("Admin");

  // Split pathname into segments, filter empty strings
  const segments = pathname.split("/").filter((segment) => segment !== "");

  // Helper to get translated title
  const getTitle = (segment: string, index: number, allSegments: string[]) => {
    // Check if it's a UUID/ID (simple check)
    const isId = segment.length > 20 && /\d/.test(segment);
    if (isId) return t("products.table.viewDetails"); // Fallback for IDs, or could start "Details"

    // Special cases
    if (segment === "create") return t("products.add"); // Generic "Add" or context specific?

    // Try sidebar keys first
    if (
      [
        "dashboard",
        "products",
        "orders",
        "customers",
        "finance",
        "settings",
      ].includes(segment)
    ) {
      return t(`sidebar.${segment}`);
    }

    // Just capitalize as fallback
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  if (segments.length === 0) {
    return null; // Don't show on root if that's Dashboard? Or show "Dashboard"?
    // Usually Dashboard root is / or /dashboard.
    // next-intl usePathname on /en returns /? No, usually /
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link href="/">{t("sidebar.dashboard")}</Link>}
          ></BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          const title = getTitle(segment, index, segments);

          // Skip "dashboard" if it's in the URL but we already rendered Home link above
          if (segment === "dashboard") return null;

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={href}>{title}</Link>} />
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
