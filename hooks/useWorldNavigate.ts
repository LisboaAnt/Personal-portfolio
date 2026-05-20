"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useWorldStore } from "@/stores/world-store";
import { resolveCvSection, sectionToHash } from "@/world/path-to-room";
import { isCvSectionId } from "@/world/scroll-rooms";
import {
  WORLD_CAMERA_DURATION_S,
  WORLD_OVERLAY_ENTER_DELAY_MS,
  WORLD_OVERLAY_FADE_IN_MS,
} from "@/world/constants";
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
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior, block: "start" });
}

export function useWorldNavigate() {
  const router = useRouter();
  const enabled = useWorldEnabled();
  const beginTravel = useWorldStore((s) => s.beginTravel);
  const setFocusRoom = useWorldStore((s) => s.setFocusRoom);
  const setPhase = useWorldStore((s) => s.setPhase);

  const navigate = useCallback(
    (href: WorldHref) => {
      const { section, hash } = parseHref(href);

      if (!enabled) {
        if (typeof window !== "undefined") {
          window.location.hash = hash;
          scrollToSection(section);
        } else {
          router.push({ pathname: "/", hash: section } as Parameters<typeof router.push>[0]);
        }
        return;
      }

      const isHashOnly =
        typeof href === "string" && (href.startsWith("#") || href.startsWith("/#"));

      if (isHashOnly) {
        setFocusRoom(section);
        scrollToSection(section);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", `${window.location.pathname}${hash}`);
        }
        return;
      }

      beginTravel(section);
      router.push({ pathname: "/", hash: section } as Parameters<typeof router.push>[0]);
      scrollToSection(section);

      const totalMs =
        WORLD_OVERLAY_ENTER_DELAY_MS + WORLD_OVERLAY_FADE_IN_MS + WORLD_CAMERA_DURATION_S * 1000;
      window.setTimeout(() => setPhase("idle"), totalMs);
    },
    [beginTravel, enabled, router, setFocusRoom, setPhase]
  );

  const goToSection = useCallback(
    (id: CvSectionId) => {
      navigate(sectionToHash(id) as WorldHref);
    },
    [navigate]
  );

  return { navigate, goToSection, enabled };
}
