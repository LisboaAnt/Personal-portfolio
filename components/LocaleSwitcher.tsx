"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<(typeof routing.locales)[number], string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
  de: "DE",
};

export function LocaleSwitcher() {
  const locale = useLocale() as (typeof routing.locales)[number];
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex max-w-[100vw] shrink-0 flex-wrap items-center justify-end gap-0.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/80 p-0.5 shadow-sm backdrop-blur-md">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={`rounded-full px-2 py-1.5 text-[10px] font-semibold tracking-wide transition-colors sm:px-3 sm:text-xs ${
            loc === locale
              ? "bg-[var(--accent)] text-white shadow-sm"
              : "text-[var(--muted)] hover:bg-[var(--surface)]/80 hover:text-[var(--foreground)]"
          }`}
          aria-pressed={loc === locale}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
