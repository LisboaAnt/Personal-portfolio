"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useWorldMobileBlocked } from "@/hooks/useWorldEnabled";

export function WorldModePanel() {
  const t = useTranslations("World");
  const mobileBlocked = useWorldMobileBlocked();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <p className="text-sm text-[var(--muted)]">{t("panelBody")}</p>
        {mobileBlocked ? (
          <p className="text-xs text-amber-600 dark:text-amber-400">{t("mobileUnavailable")}</p>
        ) : (
          <p className="text-xs text-[var(--accent)]">{t("panelActive")}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/lab/world"
          className="inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]/40"
        >
          {t("demoLink")}
        </Link>
      </div>
    </div>
  );
}
