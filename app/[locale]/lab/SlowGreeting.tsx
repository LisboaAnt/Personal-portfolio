import { getTranslations } from "next-intl/server";

export async function SlowGreeting({ locale }: { locale: string }) {
  await new Promise((r) => setTimeout(r, 1200));
  const t = await getTranslations({ locale, namespace: "Lab.streaming" });
  return (
    <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-3 text-sm text-[var(--muted)]">
      {t("ready")}
    </p>
  );
}
