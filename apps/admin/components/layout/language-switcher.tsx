"use client";

import * as React from "react";
import { usePathname, useRouter } from "@repo/i18n/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Button,
} from "@repo/ui";

import { HugeiconsIcon } from "@hugeicons/react";
import { Globe02Icon, Tick02Icon } from "@hugeicons/core-free-icons";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300 transition-colors"
          >
            <HugeiconsIcon
              icon={Globe02Icon}
              strokeWidth={2}
              className="h-4 w-4"
            />
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-[#141414] border-zinc-800 text-zinc-400"
      >
        <DropdownMenuItem
          onClick={() => switchLocale("en")}
          className="gap-3 focus:bg-zinc-800 focus:text-white cursor-pointer"
        >
          <span className="flex-1 text-sm">English</span>
          {locale === "en" && (
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="h-3 w-3 text-emerald-500"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale("ar")}
          className="gap-3 font-arabic focus:bg-zinc-800 focus:text-white cursor-pointer"
        >
          <span className="flex-1 text-sm">العربية</span>
          {locale === "ar" && (
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="h-3 w-3 text-emerald-500"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
