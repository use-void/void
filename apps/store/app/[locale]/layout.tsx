import localFont from "next/font/local";
import "../globals.css";
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, localeConfig } from '@repo/i18n';
import { routing } from "@repo/i18n/routing";
import { ThemeProvider } from "@repo/ui";
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
  const dir = localeConfig[locale as keyof typeof localeConfig]?.dir || 'ltr';

  // Enable static rendering
  setRequestLocale(locale);

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
