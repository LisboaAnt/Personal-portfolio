"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export const WORLD_BACKGROUND_ONLY_CLASS = "world-background-only";

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M3 3l18 18" />
        <path d="M10.58 10.58a2 2 0 0 0 2.84 2.84" />
        <path d="M9.88 5.1A10.94 10.94 0 0 1 12 5c5.52 0 10 4.48 10 7a11.2 11.2 0 0 1-2.08 3.05" />
        <path d="M6.61 6.61A11.2 11.2 0 0 0 4 12c0 2.52 4.48 7 10 7 1.05 0 2.05-.16 2.98-.45" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/** Oculta texto/UI e mostra só o fundo 3D (toggle). */
export function WorldBackgroundViewToggle() {
  const t = useTranslations("World");
  const [backgroundOnly, setBackgroundOnly] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle(WORLD_BACKGROUND_ONLY_CLASS, backgroundOnly);
    return () => document.documentElement.classList.remove(WORLD_BACKGROUND_ONLY_CLASS);
  }, [backgroundOnly]);

  const toggle = useCallback(() => {
    setBackgroundOnly((prev) => !prev);
  }, []);

  const title = backgroundOnly ? t("backgroundViewShow") : t("backgroundViewHide");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={backgroundOnly}
      aria-label={t("backgroundViewAria")}
      title={title}
      className="world-background-view-btn site-chip-btn fixed bottom-4 left-4 z-[200] h-10 w-10 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/95 text-[var(--foreground)] shadow-lg backdrop-blur-sm transition-[border-color,background,color,box-shadow] duration-300 hover:border-[var(--accent)] aria-pressed:border-[var(--accent)] aria-pressed:text-[var(--accent)]"
    >
      <EyeIcon hidden={backgroundOnly} />
    </button>
  );
}
