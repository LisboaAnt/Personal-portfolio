import { routing } from "@/i18n/routing";
import type { CvSectionId } from "./types";
import { isCvSectionId } from "./scroll-rooms";

export function normalizePathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && routing.locales.includes(segments[0] as (typeof routing.locales)[number])) {
    const rest = segments.slice(1);
    return rest.length ? `/${rest.join("/")}` : "/";
  }
  return pathname || "/";
}

const LEGACY_PATH_SECTION: Record<string, CvSectionId> = {
  "/work": "experience",
  "/flow": "education",
  "/lab": "skills",
};

/** Secção activa: hash > legado de rota > perfil (início) */
export function resolveCvSection(pathname: string, hash?: string): CvSectionId {
  const cleanHash = hash?.replace(/^#/, "") ?? "";
  if (cleanHash && isCvSectionId(cleanHash)) return cleanHash;

  const path = normalizePathname(pathname);
  if (LEGACY_PATH_SECTION[path]) return LEGACY_PATH_SECTION[path];

  return "profile";
}

export function pathToRoomId(pathname: string): CvSectionId {
  if (typeof window !== "undefined") {
    return resolveCvSection(pathname, window.location.hash);
  }
  return resolveCvSection(pathname);
}

/** Uma única página — navegação por hash */
export function sectionToHash(id: CvSectionId): string {
  return `#${id}`;
}

export function roomIdToPath(): "/" {
  return "/";
}
