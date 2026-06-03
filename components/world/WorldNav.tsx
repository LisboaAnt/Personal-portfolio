"use client";

import { useTranslations } from "next-intl";
import { WorldLink } from "./WorldLink";

const SECTIONS = [
  "profile",
  "experience",
  "projects",
  "education",
  "skills",
  "contact",
] as const;

const linkClass =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-medium tracking-tight text-[var(--muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)] sm:px-2 sm:py-1 sm:text-[11px] md:text-xs";

export function WorldNav() {
  const t = useTranslations("Nav");

  return (
    <nav className="world-cv-nav min-w-0 flex-1 overflow-hidden" aria-label={t("aria")}>
      <ul className="flex flex-nowrap items-center gap-0.5 overflow-x-auto py-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map((id) => (
          <li key={id} className="shrink-0">
            <WorldLink href={`#${id}` as const} className={linkClass}>
              <span className="max-md:inline md:hidden">{t(`cvShort.${id}`)}</span>
              <span className="hidden md:inline">{t(`cv.${id}`)}</span>
            </WorldLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
