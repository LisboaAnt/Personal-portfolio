"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useWorldEnabled, useWorldMobileBlocked } from "@/hooks/useWorldEnabled";
import { setWorld3DEnabled } from "@/world/world-preference";

export function WorldModeToggle() {
  const t = useTranslations("World");
  const enabled = useWorldEnabled();
  const mobileBlocked = useWorldMobileBlocked();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-8 min-w-[3.25rem] rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/60 sm:min-w-[4.5rem]"
        aria-hidden
      />
    );
  }

  const is3d = enabled;

  const handleClick = () => {
    if (mobileBlocked) return;
    setWorld3DEnabled(!is3d);
  };

  const label = is3d ? t("modeClassic") : t("mode3d");
  const title = mobileBlocked ? t("mobileUnavailable") : is3d ? t("modeClassicHint") : t("mode3dHint");

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={mobileBlocked}
      className="flex h-8 max-w-[5.5rem] items-center justify-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--foreground)] shadow-sm backdrop-blur-md transition hover:border-[var(--accent)]/40 disabled:cursor-not-allowed disabled:opacity-50 sm:max-w-[6.5rem] sm:px-2.5"
      title={title}
      aria-label={t("modeAria")}
      aria-pressed={is3d}
    >
      <span className="text-base leading-none" aria-hidden>
        {is3d ? "◇" : "◆"}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
