import { useTranslations } from "@repo/i18n";

export function HeroSection() {
  const t = useTranslations("Admin.dashboard");
  return (
    <div className="flex flex-col gap-1 mb-8">
      <h2 className="text-3xl font-light tracking-tight text-foreground">
        {t("dashboardTitle")}
      </h2>
      <p className="text-muted-foreground font-light">{t("dashboardDesc")}</p>
    </div>
  );
}
