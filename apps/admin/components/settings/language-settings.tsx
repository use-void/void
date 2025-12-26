"use client";

import React from "react";
import { useTranslations } from "@repo/i18n";

export function LanguageSettingsForm({ initialData, locale, id }: { initialData: any, locale: string, id?: string }) {
  const t = useTranslations("Admin.settings");

  return (
    <form id={id} className="w-full">
        {/* Empty Page Content as requested */}
        <div className="border-2 border-dashed border-border/20 rounded-xl p-10 flex items-center justify-center text-muted-foreground h-96">
            Language Settings Content Area
        </div>
    </form>
  );
}
