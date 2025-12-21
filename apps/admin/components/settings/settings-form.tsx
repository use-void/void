'use client';

import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from "@repo/ui";
import { useTranslations } from "next-intl";

export function SettingsForm() {
    const t = useTranslations("Admin.settings");

    return (
        <Card className="bg-card border-border rounded-xl max-w-2xl">
            <CardHeader>
                <CardTitle>{t("generalSettings")}</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="storeName">{t("storeName")}</Label>
                        <Input id="storeName" placeholder={t("storeNamePlaceholder")} defaultValue="My Awesome Store" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="supportEmail">{t("supportEmail")}</Label>
                        <Input id="supportEmail" type="email" placeholder={t("supportEmailPlaceholder")} defaultValue="support@example.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="currency">{t("currency")}</Label>
                        <Input id="currency" placeholder="USD" defaultValue="USD" />
                    </div>
                    <div className="pt-4">
                        <Button type="submit">{t("saveChanges")}</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
