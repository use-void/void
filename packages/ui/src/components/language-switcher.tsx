"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@repo/i18n/navigation";
import { buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { LanguageSquareIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { useTransition } from "react";
import { locales, getLocaleLabel, getLocaleFlag } from "@repo/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LanguageSwitcherProps {
  variant?: "default" | "outline" | "ghost" | "store" | "admin" | "blog";
}

export function LanguageSwitcher({
  variant = "default",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        className={cn(
          buttonVariants({
            variant: variant === "store" ? "ghost" : "outline",
            size: variant === "admin" ? "sm" : "default",
          }),
          "gap-2 h-9 px-4 py-2" // Adjust size slightly for consistency
        )}
      >
        {isPending ? (
          <HugeiconsIcon
            icon={Loading03Icon}
            strokeWidth={2}
            className="h-4 w-4 animate-spin"
          />
        ) : (
          <HugeiconsIcon
            icon={LanguageSquareIcon}
            strokeWidth={2}
            className="h-4 w-4"
          />
        )}
        <span className="hidden sm:inline-block">
          {getLocaleLabel(locale)}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Select Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={handleLocaleChange}
          >
            {locales.map((l) => (
              <DropdownMenuRadioItem key={l} value={l}>
                <span className="flex items-center gap-2">
                  <span>{getLocaleFlag(l)}</span>
                  <span>{getLocaleLabel(l)}</span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
