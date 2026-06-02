import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { LabCounterDemo } from "@/components/LabCounterDemo";
import { LabPathnameBadge } from "@/components/LabPathnameBadge";
import { FakeTerminal } from "@/components/FakeTerminal";
import { LabThemeBadge } from "@/components/LabThemeBadge";
import { LabThemeProvider } from "@/components/LabThemeProvider";
import { SlowGreeting } from "./SlowGreeting";
import { WorldModePanel } from "@/components/world/WorldModePanel";

type Props = { params: Promise<{ locale: string }> };

const card =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 p-5 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-md dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Lab.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function LabPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Lab");

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6 sm:py-16">
      <header data-world-room="lab" className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{t("kicker")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{t("intro")}</p>
      </header>

      <section data-world-room="lab" className={`${card} space-y-3`} aria-labelledby="world3d-heading">
        <h2 id="world3d-heading" className="text-lg font-semibold">
          {t("world3d.title")}
        </h2>
        <WorldModePanel />
      </section>

      <section className={`${card} space-y-3`} aria-labelledby="stream-heading">
        <h2 id="stream-heading" className="text-lg font-semibold">
          {t("streaming.title")}
        </h2>
        <p className="text-sm text-[var(--muted)]">{t("streaming.body")}</p>
        <Suspense
          fallback={
            <div className="h-12 animate-pulse rounded-xl bg-[var(--border)]" aria-busy="true" />
          }
        >
          <SlowGreeting locale={locale} />
        </Suspense>
      </section>

      <section className={`${card} space-y-3`} aria-labelledby="action-heading">
        <h2 id="action-heading" className="text-lg font-semibold">
          {t("action.title")}
        </h2>
        <p className="text-sm text-[var(--muted)]">{t("action.body")}</p>
        <LabCounterDemo />
      </section>

      <section className={`${card} space-y-3`} aria-labelledby="path-heading">
        <h2 id="path-heading" className="text-lg font-semibold">
          {t("path.title")}
        </h2>
        <p className="text-sm text-[var(--muted)]">{t("path.body")}</p>
        <LabPathnameBadge />
      </section>

      <section className={`${card} space-y-3`} aria-labelledby="theme-heading">
        <h2 id="theme-heading" className="text-lg font-semibold">
          {t("themeDemo.title")}
        </h2>
        <p className="text-sm text-[var(--muted)]">{t("themeDemo.body")}</p>
        <LabThemeProvider>
          <LabThemeBadge />
        </LabThemeProvider>
      </section>

      <section className={`${card} space-y-3`} aria-labelledby="term-heading">
        <h2 id="term-heading" className="text-lg font-semibold">
          {t("terminal.sectionTitle")}
        </h2>
        <p className="text-sm text-[var(--muted)]">{t("terminal.body")}</p>
        <FakeTerminal />
      </section>

      <section className={`${card} border-dashed`} aria-labelledby="egg-heading">
        <h2 id="egg-heading" className="text-lg font-semibold">
          {t("eggs.title")}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{t("eggs.body")}</p>
      </section>
    </div>
  );
}
