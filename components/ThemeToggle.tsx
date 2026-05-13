"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const t = useTranslations("Theme");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-8 min-w-[7.5rem] rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/60"
        aria-hidden
      />
    );
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const label =
    theme === "light" ? t("light") : theme === "dark" ? t("dark") : t("system");

  const titleAttr =
    theme === "system" && resolvedTheme
      ? `${t("cycleHint")} · ${resolvedTheme}`
      : t("cycleHint");

  return (
    <button
      type="button"
      onClick={cycle}
      className="flex h-8 max-w-[9rem] items-center justify-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--foreground)] shadow-sm backdrop-blur-md transition hover:border-[var(--accent)]/40 sm:max-w-[10rem] sm:px-2.5"
      title={titleAttr}
      aria-label={t("aria")}
    >
      <span className="text-base leading-none" aria-hidden>
        {theme === "light" ? "☀" : theme === "dark" ? "☾" : "◐"}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
