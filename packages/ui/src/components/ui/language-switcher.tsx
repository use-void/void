"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@repo/i18n/navigation";
import { Button } from "./button";
import { Languages, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { locales, getLocaleLabel, getLocaleFlag } from "@repo/i18n";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu";

interface LanguageSwitcherProps {
    variant?: "default" | "outline" | "ghost" | "store" | "admin" | "blog";
}

export function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
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
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant === "store" ? "ghost" : "outline"}
                    size={variant === "admin" ? "sm" : "default"}
                    disabled={isPending}
                    className="gap-2"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Languages className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline-block">
                        {getLocaleLabel(locale)}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={locale} onValueChange={handleLocaleChange}>
                    {locales.map((l) => (
                        <DropdownMenuRadioItem key={l} value={l}>
                            <span className="flex items-center gap-2">
                                <span>{getLocaleFlag(l)}</span>
                                <span>{getLocaleLabel(l)}</span>
                            </span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}