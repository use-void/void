"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldCheck, ArrowRight, Mail, Lock } from "lucide-react";
import { authClient } from "@void/auth/client";
import { Link, useRouter } from "@repo/i18n/navigation";
import { useTranslations } from "@repo/i18n";

import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@repo/ui";

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(1, {
        message: "Password is required.",
    }),
});

export function LoginForm() {
    const t = useTranslations('Admin.auth');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await authClient.signIn.email({
                email: values.email,
                password: values.password,
                callbackURL: "/",
            });

            if (error) {
                setError(error.message || t('authFailed'));
                setIsLoading(false);
            } else {
                // Keep loading true while redirecting
                router.push("/");
            }
        } catch (err) {
            setError(t('unexpectedError'));
            console.error(err);
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-md bg-card border border-border transition-colors duration-300 hover:border-zinc-700">
            <CardHeader className="space-y-4 text-center pb-8 pt-8">
                <div className="flex justify-center mb-4">
                    <div className=" bg-zinc-900 border border-border p-3">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                </div>
                <div className="space-y-2">
                    <CardTitle className="text-2xl font-light tracking-tight text-white">
                        {t('welcomeBack')}
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        {t('enterCredentials')}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-400 font-normal">{t('email')}</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-600 transition-colors" />
                                            <Input
                                                placeholder="admin@void.com"
                                                className="pl-10 h-11 bg-transparent border-zinc-800 focus:border-white/20 focus:ring-0  text-white placeholder:text-zinc-600 transition-all font-light"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel className="text-zinc-400 font-normal">{t('password')}</FormLabel>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-normal text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {t('forgotPassword')}
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-600 transition-colors" />
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-11 bg-transparent border-zinc-800 focus:border-white/20 focus:ring-0  text-white placeholder:text-zinc-600 transition-all font-light"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className=" bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400 flex items-center justify-center">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-normal bg-white text-black hover:bg-zinc-200  transition-colors duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('verifying')}
                                </>
                            ) : (
                                <>
                                    {t('signIn')}
                                    <ArrowRight className="ml-2 h-5 w-5 opacity-50" />
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border/50 pt-6 pb-8">
                <p className="text-sm text-zinc-500 font-light">
                    {t('dontHaveAccount')}{" "}
                    <Link
                        href="/register"
                        className="font-medium text-white hover:underline underline-offset-4"
                    >
                        {t('createAccount')}
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
