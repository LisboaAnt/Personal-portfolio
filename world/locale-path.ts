import { routing } from "@/i18n/routing";
import { sectionToHash } from "./path-to-room";
import type { CvSectionId } from "./types";

export type AppLocale = (typeof routing.locales)[number];

export function getLocaleFromPathname(pathname: string): AppLocale {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && routing.locales.includes(first as AppLocale)) {
    return first as AppLocale;
  }
  return routing.defaultLocale;
}

/** Início do site + hash de secção CV (`localePrefix: as-needed`). */
export function homePathWithSectionHash(pathname: string, section: CvSectionId): string {
  const locale = getLocaleFromPathname(pathname);
  const hash = sectionToHash(section);
  if (locale === routing.defaultLocale) return `/${hash}`;
  return `/${locale}${hash}`;
}
