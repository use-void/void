"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@repo/i18n/navigation";
import { useTranslations } from "@repo/i18n";
import { Sparkles, ArrowRight, Check } from "lucide-react";
import { Button } from "@repo/ui";

export function SuccessView({ redirectUrl }: { redirectUrl: string }) {
  const t = useTranslations("Admin.setup.success");
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) {
      router.push(redirectUrl);
      return;
    }
    const timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, redirectUrl, router]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-10">
        <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
            <div className="relative h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <Sparkles className="h-10 w-10 text-green-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white ring-4 ring-background">
                <Check className="h-5 w-5" />
            </div>
        </div>

        <div className="space-y-3 max-w-xs mx-auto">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {t("title")}
            </h2>
            <p className="text-muted-foreground text-sm">
                {t("description", { seconds: countdown })}
            </p>
        </div>

        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden max-w-[200px]">
             <div 
                className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
             />
        </div>

        <Button 
            variant="ghost" 
            onClick={() => router.push(redirectUrl)}
            className="text-muted-foreground hover:text-foreground mt-4"
        >
            {t("button")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    </div>
  );
}