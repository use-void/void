// apps/admin/components/setup-wizard.tsx

"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations } from "@repo/i18n";
import { useRouter } from "@repo/i18n/navigation";
import {
    Button,
    Card,
    CardContent,
    CardFooter,
    Input,
    Label
} from "@repo/ui";
import {
    Loader2,
    Store,
    MapPin,
    Globe,
    Phone,
    Lock,
    User,
    Check,
    Database,
    ArrowRight,
    ArrowLeft,
    Sparkles
} from "lucide-react";

// استيراد Server Action (يجب أن يحتوي الملف المصدر على "use server" في بدايته)
import { initializeStore } from "../lib/actions/setup";

// --- Types ---
const TOTAL_STEPS = 4;

type ActionResponse = {
    error?: string;
    success?: boolean;
    redirectUrl?: string;
};

export function SetupWizard() {
    const t = useTranslations("Admin.setup");
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<{ url: string } | null>(null);
    const [countdown, setCountdown] = useState(5);

    // --- Effects ---
    useEffect(() => {
        if (!successData) return;

        if (countdown === 0) {
            router.push(successData.url);
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [successData, countdown, router]);

    // --- Form State ---
    const [formData, setFormData] = useState({
        storeName: "",
        storeDescription: "",
        storeLogo: "",
        country: "",
        city: "",
        address: "",
        storePhone: "",
        timezone: "UTC",
        currency: "USD",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        shouldSeed: false
    });

    // --- Handlers ---
    const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    const handleBack = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = () => {
        if (formData.password !== formData.confirmPassword) {
            setError(t('fields.passwordsDoNotMatch'));
            return;
        }

        setError(null);
        startTransition(async () => {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, String(value));
            });

            try {
                // استدعاء السيرفر أكشن (الآن أصبح آمناً ونعرف نوع البيانات العائدة)
                const res = await initializeStore(data) as ActionResponse;
                
                if (res?.error) {
                    setError(res.error);
                } else if (res?.success && res.redirectUrl) {
                    setSuccessData({ url: res.redirectUrl });
                }
            } catch (e) {
                console.error(e);
                setError(t('errors.generic') || "An unexpected error occurred");
            }
        });
    };

    // --- Validation ---
    const isStepValid = () => {
        switch (step) {
            case 1: return !!formData.storeName && !!formData.storeDescription;
            case 2: return !!formData.country && !!formData.city && !!formData.address;
            case 3: return !!formData.firstName && !!formData.lastName && !!formData.email && !!formData.password && !!formData.confirmPassword;
            default: return true;
        }
    };

    // --- Render: Success View ---
    if (successData) {
        return (
            <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto animate-in fade-in duration-700">
                <Card className="w-full border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                    <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-2 ring-1 ring-primary/20">
                            <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                {t('successTitle')}
                            </h2>
                            <p className="text-muted-foreground">
                                {t('successRedirect', { seconds: countdown })}
                            </p>
                        </div>

                        {/* CSS-only Progress Bar */}
                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden mt-6">
                            <div
                                className="h-full bg-primary transition-[width] duration-1000 ease-linear"
                                style={{ width: `${(countdown / 5) * 100}%` }}
                            />
                        </div>

                        <Button
                            variant="ghost"
                            onClick={() => router.push(successData.url)}
                            className="mt-4 text-muted-foreground hover:text-foreground"
                        >
                            {t('buttons.next')} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // --- Render: Main Wizard ---
    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-2 mb-4">
                <h1 className="text-3xl font-light tracking-tight text-foreground">
                    {t('welcomeTitle')}
                </h1>
                <p className="text-muted-foreground font-light text-sm max-w-md mx-auto">
                    {t('welcomeDesc')}
                </p>
            </div>

            <Card className="border-border shadow-2xl bg-card">
                {/* Stepper Header */}
                <div className="border-b border-border p-6 pb-8">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 w-full h-[1px] bg-secondary -z-10" />

                        {[1, 2, 3, 4].map((s) => {
                            const isActive = step >= s;
                            const isCurrent = step === s;
                            return (
                                <div key={s} className="flex flex-col items-center gap-2 bg-card px-2">
                                    <div
                                        className={`
                                            flex items-center justify-center w-8 h-8 rounded-full border text-xs font-medium transition-all duration-300
                                            ${isActive
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "bg-card border-border text-muted-foreground"
                                            }
                                            ${isCurrent ? "ring-4 ring-primary/10" : ""}
                                        `}
                                    >
                                        {step > s ? <Check className="w-4 h-4" /> : s}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 text-center">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t(`steps.${getStepKey(step)}`)}
                        </span>
                    </div>
                </div>

                {/* Dynamic Content */}
                <CardContent className="p-8 min-h-[420px] relative overflow-hidden">
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500" key={step}>
                        {step === 1 && (
                            <div className="space-y-5">
                                <InputField
                                    label={t('fields.storeName')}
                                    icon={Store}
                                    value={formData.storeName}
                                    onChange={(v) => setFormData({ ...formData, storeName: v })}
                                    placeholder="Acme Corp"
                                    required
                                />
                                <InputField
                                    label={t('fields.description')}
                                    value={formData.storeDescription}
                                    onChange={(v) => setFormData({ ...formData, storeDescription: v })}
                                    placeholder="Best store..."
                                    required
                                />
                                <InputField
                                    label={t('fields.logo')}
                                    value={formData.storeLogo}
                                    onChange={(v) => setFormData({ ...formData, storeLogo: v })}
                                    placeholder="https://..."
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label={t('fields.country')} icon={Globe} value={formData.country} onChange={(v) => setFormData({ ...formData, country: v })} placeholder="USA" required />
                                    <InputField label={t('fields.city')} value={formData.city} onChange={(v) => setFormData({ ...formData, city: v })} placeholder="NY" required />
                                </div>
                                <InputField label={t('fields.address')} icon={MapPin} value={formData.address} onChange={(v) => setFormData({ ...formData, address: v })} placeholder="123 St." required />
                                <InputField label={t('fields.phone')} icon={Phone} value={formData.storePhone} onChange={(v) => setFormData({ ...formData, storePhone: v })} placeholder="+123..." />

                                <div className="grid grid-cols-2 gap-4">
                                    <SelectField
                                        label={t('fields.currency')}
                                        value={formData.currency}
                                        onChange={(v) => setFormData({ ...formData, currency: v })}
                                        options={[
                                            { value: "USD", label: "USD ($)" },
                                            { value: "SAR", label: "SAR (ر.س)" },
                                            { value: "EUR", label: "EUR (€)" },
                                            { value: "GBP", label: "GBP (£)" },
                                        ]}
                                    />
                                    <SelectField
                                        label={t('fields.timezone')}
                                        value={formData.timezone}
                                        onChange={(v) => setFormData({ ...formData, timezone: v })}
                                        options={[
                                            { value: "UTC", label: "UTC" },
                                            { value: "Asia/Riyadh", label: "Riyadh" },
                                            { value: "Europe/London", label: "London" },
                                            { value: "America/New_York", label: "New York" },
                                        ]}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label={t('fields.firstName')} value={formData.firstName} onChange={(v) => setFormData({ ...formData, firstName: v })} placeholder="John" required />
                                    <InputField label={t('fields.lastName')} value={formData.lastName} onChange={(v) => setFormData({ ...formData, lastName: v })} placeholder="Doe" required />
                                </div>
                                <InputField label={t('fields.email')} icon={User} type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="admin@void.com" required />
                                <InputField label={t('fields.mobile')} icon={Phone} value={formData.mobile} onChange={(v) => setFormData({ ...formData, mobile: v })} placeholder="+123..." />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField label={t('fields.password')} icon={Lock} type="password" value={formData.password} onChange={(v) => setFormData({ ...formData, password: v })} placeholder="••••••••" required />
                                    <InputField label={t('fields.confirmPassword')} icon={Lock} type="password" value={formData.confirmPassword} onChange={(v) => setFormData({ ...formData, confirmPassword: v })} placeholder="••••••••" required />
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 pt-4">
                                <label className="relative flex items-start p-5 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 hover:border-primary/20 cursor-pointer transition-all duration-300 group">
                                    <div className="flex items-center h-5 mt-1">
                                        <input
                                            type="checkbox"
                                            checked={formData.shouldSeed}
                                            onChange={(e) => setFormData({ ...formData, shouldSeed: e.target.checked })}
                                            className="h-5 w-5 rounded border-input bg-background text-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="ml-4 text-sm leading-6">
                                        <div className="font-medium text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                                            <Database className="h-4 w-4" />
                                            {t('fields.seedData')}
                                        </div>
                                        <p className="text-muted-foreground mt-1 group-hover:text-muted-foreground/80">
                                            {t('fields.seedDesc')}
                                        </p>
                                    </div>
                                </label>

                                {error && (
                                    <div className="p-4 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg flex items-center justify-center animate-in fade-in zoom-in-95">
                                        {error}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Footer Actions */}
                <CardFooter className="flex justify-between border-t border-border p-6 bg-muted/10">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1 || isPending}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('buttons.back')}
                    </Button>

                    {step < TOTAL_STEPS ? (
                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10"
                        >
                            {t('buttons.next')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px] shadow-lg shadow-primary/20"
                        >
                            {isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    {t('buttons.complete')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

// --- Helper Components (Local Islands) ---

function InputField({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    icon: Icon,
    required = false
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    type?: string;
    icon?: any;
    required?: boolean;
}) {
    return (
        <div className="space-y-2 group">
            <Label className="text-xs font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                )}
                <Input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`h-10 bg-muted/30 border-input hover:border-ring/50 focus:border-primary focus:bg-background transition-all duration-300 ${Icon ? 'pl-9' : ''}`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

function SelectField({
    label,
    value,
    onChange,
    options
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[]
}) {
    return (
        <div className="space-y-2 group">
            <Label className="text-xs font-medium text-muted-foreground group-focus-within:text-primary transition-colors">
                {label} <span className="text-destructive">*</span>
            </Label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-muted/30 px-3 py-2 text-sm text-foreground shadow-sm transition-all hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-popover text-popover-foreground">
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function getStepKey(step: number) {
    switch (step) {
        case 1: return "store";
        case 2: return "store";
        case 3: return "admin";
        case 4: return "finish";
        default: return "store";
    }
}