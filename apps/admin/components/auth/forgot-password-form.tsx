"use client";

import { Link } from "@repo/i18n/navigation";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input } from "@repo/ui";
import { useTranslations } from "next-intl";
import { ArrowLeft, Mail } from "lucide-react";

export function ForgotPasswordForm() {
    const t = useTranslations('Admin.auth');
    return (
        <Card className="relative z-10 w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-8">
                <CardTitle className="text-2xl font-bold">{t('forgotPasswordTitle')}</CardTitle>
                <CardDescription>
                    {t('forgotPasswordDesc')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative group">
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="admin@void.com"
                        className="pl-10 h-11 bg-background/50 border-border/50"
                    />
                </div>
                <Button className="w-full h-11">
                    {t('sendResetLink')}
                </Button>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border/50 pt-6">
                <Link
                    href="/login"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('backToLogin')}
                </Link>
            </CardFooter>
        </Card>
    );
}
