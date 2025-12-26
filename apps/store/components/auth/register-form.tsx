"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UserPlus, ArrowRight, Mail, Lock, User } from "lucide-react";
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
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export function RegisterForm() {
    const t = useTranslations('Store.auth');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);
        try {
            const { error } = await authClient.signUp.email({
                email: values.email,
                password: values.password,
                name: values.name,
                callbackURL: "/",
            });

            if (error) {
                setError(error.message || t('registrationFailed'));
                setIsLoading(false);
            } else {
                router.push("/");
            }
        } catch (err) {
            setError(t('unexpectedError'));
            console.error(err);
            setIsLoading(false);
        }
    }

    return (
        <Card className="relative z-10 w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl transition-all duration-300 hover:shadow-primary/5 hover:border-primary/20">
            <CardHeader className="space-y-2 text-center pb-8 pt-8">
                <div className="flex justify-center mb-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-50" />
                        <div className="relative bg-gradient-to-br from-background to-muted border border-border/50 p-4 shadow-inner">
                            <UserPlus className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                    {t('createAccountTitle')}
                </CardTitle>
                <CardDescription className="text-base">
                    {t('joinStore')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('fullName')}</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                placeholder="John Doe"
                                                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('email')}</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <Input
                                                placeholder="customer@example.com"
                                                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('password')}</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
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
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('confirmPassword')}</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all"
                                                    {...field}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {error && (
                            <div className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive flex items-center justify-center border border-destructive/20 animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-medium shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    {t('creatingAccount')}
                                </>
                            ) : (
                                <>
                                    {t('createAccount')}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border/50 pt-6 pb-8">
                <p className="text-sm text-muted-foreground font-light">
                    {t('alreadyHaveAccount')}{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4"
                    >
                        {t('signIn')}
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
