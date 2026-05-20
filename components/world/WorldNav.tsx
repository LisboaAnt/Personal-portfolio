"use client";

import { useTranslations } from "next-intl";
import { WorldLink } from "./WorldLink";

const link =
  "rounded-lg px-2 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] sm:px-2.5 sm:text-sm";

const SECTIONS = [
  "profile",
  "experience",
  "projects",
  "education",
  "skills",
  "contact",
] as const;

export function WorldNav() {
  const t = useTranslations("Nav");

  return (
    <nav
      className="flex max-w-[52vw] flex-1 items-center justify-end gap-0.5 overflow-x-auto sm:max-w-none sm:justify-center sm:gap-1"
      aria-label={t("aria")}
    >
      {SECTIONS.map((id) => (
        <WorldLink key={id} href={`#${id}` as const} className={link}>
          {t(`cv.${id}`)}
        </WorldLink>
      ))}
    </nav>
  );
}
