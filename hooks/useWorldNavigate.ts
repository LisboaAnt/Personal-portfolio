"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWorldStore } from "@/stores/world-store";
import { homePathWithSectionHash } from "@/world/locale-path";
import { resolveCvSection, sectionToHash } from "@/world/path-to-room";
import { isCvSectionId } from "@/world/scroll-rooms";
import {
  WORLD_CAMERA_DURATION_S,
  WORLD_OVERLAY_ENTER_DELAY_MS,
  WORLD_OVERLAY_FADE_IN_MS,
  WORLD_SECTION_CAMERA_DURATION_S,
} from "@/world/constants";
import { scrollToCvSection } from "@/lib/cv-scroll";
import type { CvSectionId } from "@/world/types";
import { useWorldEnabled } from "./useWorldEnabled";

export type WorldHref = "/" | `/#${string}` | `#${string}` | { pathname: "/"; hash?: string };

function parseHref(href: WorldHref): { section: CvSectionId; hash: string } {
  if (typeof href === "string") {
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (isCvSectionId(id)) return { section: id, hash: sectionToHash(id) };
    }
    if (href.includes("#")) {
      const id = href.split("#")[1] ?? "profile";
      if (isCvSectionId(id)) return { section: id, hash: sectionToHash(id) };
    }
    return { section: "profile", hash: sectionToHash("profile") };
  }
  const hashRaw = href.hash?.replace(/^#/, "") ?? "profile";
  const section = isCvSectionId(hashRaw) ? hashRaw : "profile";
  return { section, hash: sectionToHash(section) };
}

function scrollToSection(id: CvSectionId, behavior: ScrollBehavior = "smooth") {
  scrollToCvSection(id, behavior);
}

function releaseScrollNavAfterMs(ms: number) {
  window.setTimeout(() => {
    if (useWorldStore.getState().phase === "traveling") {
      useWorldStore.getState().setPhase("idle");
    }
  }, ms);
}

function scrollNavDurationMs() {
  return Math.max(WORLD_SECTION_CAMERA_DURATION_S * 1000, 720) + 120;
}

export function useWorldNavigate() {
  const router = useRouter();
  const enabled = useWorldEnabled();
  const beginTravel = useWorldStore((s) => s.beginTravel);
  const beginScrollNav = useWorldStore((s) => s.beginScrollNav);
  const setPhase = useWorldStore((s) => s.setPhase);

  const navigate = useCallback(
    (href: WorldHref) => {
      const { section, hash } = parseHref(href);

      if (!enabled) {
        if (typeof window !== "undefined") {
          window.location.hash = hash;
          scrollToSection(section);
        } else {
          router.push(homePathWithSectionHash("/", section));
        }
        return;
      }

      const isHashOnly =
        typeof href === "string" && (href.startsWith("#") || href.startsWith("/#"));

      if (isHashOnly) {
        beginScrollNav(section);
        scrollToSection(section);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
          releaseScrollNavAfterMs(scrollNavDurationMs());
        }
        return;
      }

      beginTravel(section);
      const path =
        typeof window !== "undefined"
          ? homePathWithSectionHash(window.location.pathname, section)
          : homePathWithSectionHash("/", section);
      router.push(path);
      scrollToSection(section);

      const totalMs =
        WORLD_OVERLAY_ENTER_DELAY_MS + WORLD_OVERLAY_FADE_IN_MS + WORLD_CAMERA_DURATION_S * 1000;
      window.setTimeout(() => setPhase("idle"), totalMs);
    },
    [beginScrollNav, beginTravel, enabled, router, setPhase]
  );

  const goToSection = useCallback(
    (id: CvSectionId) => {
      navigate(sectionToHash(id) as WorldHref);
    },
    [navigate]
  );

  return { navigate, goToSection, enabled };
}
