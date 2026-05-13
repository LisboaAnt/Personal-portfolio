"use client";

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function LabPathnameBadge() {
  const pathname = usePathname();
  const t = useTranslations("Lab.path");

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-4 py-3">
      <p className="text-xs font-medium text-[var(--muted)]">{t("label")}</p>
      <code className="mt-2 block break-all text-sm text-[var(--accent)]">{pathname}</code>
      <p className="mt-2 text-xs text-[var(--muted)]">{t("hint")}</p>
    </div>
  );
}
