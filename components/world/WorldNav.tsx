"use client";

import { useTranslations } from "next-intl";
import { WorldLink } from "./WorldLink";

const link =
  "rounded-md px-1.5 py-1 text-[10px] font-medium text-[var(--muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] sm:px-2 sm:text-xs";

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
      className="flex min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto px-0.5 sm:gap-1"
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
