import { Inter } from "next/font/google";
import "../globals.css";
import { notFound } from 'next/navigation';
import { 
  hasLocale,
  setRequestLocale,
  getLocaleDir,
  getMessages,
  NextIntlClientProvider,
} from '@repo/i18n';
import { routing } from "@repo/i18n/routing";
import { ThemeProvider, cn, Toaster } from "@repo/ui";
import { getTranslations } from '@repo/i18n';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Store' });

  return {
    title: t('title', { default: 'Store' }),
    description: t('description', { default: 'Shop our latest products' }),
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = getLocaleDir(locale);

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className={cn(inter.variable, "h-full antialiased")}>
      <body className="h-full bg-background overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster position="bottom-left" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
