import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteChrome } from "@/components/SiteChrome";
import { EasterEggHost } from "@/components/EasterEggHost";
import { ThemeProvider } from "@/components/ThemeProvider";
import "../globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${dmSans.className} ${dmSans.variable} min-h-screen bg-[var(--surface)] text-[var(--foreground)] antialiased`}
      >
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <EasterEggHost />
            <SiteChrome locale={locale}>{children}</SiteChrome>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
