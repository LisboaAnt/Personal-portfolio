"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export function LabThemeBadge() {
  const t = useTranslations("Lab.themeDemo");
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) {
    return <p className="text-sm text-[var(--muted)]">{t("loading")}</p>;
  }

  return (
    <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-3 py-2 font-mono text-xs text-[var(--muted)]">
      {t("line", {
        chosen: theme ?? "—",
        resolved: resolvedTheme ?? "—",
      })}
    </p>
  );
}
