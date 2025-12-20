import { Inter } from "next/font/google";
import {
  hasLocale,
  setRequestLocale,
  getLocaleDir,
  getMessages,
  NextIntlClientProvider,
} from "@repo/i18n";
import { routing } from "@repo/i18n/routing";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@repo/ui";
import { cn } from "@repo/ui";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);
  const messages = await getMessages();

  const dir = getLocaleDir(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={cn(inter.variable, "scroll-smooth antialiased h-full")}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
