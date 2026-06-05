"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useWorldStore } from "@/stores/world-store";
import { isCvScrollLocked } from "@/lib/cv-scroll";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { pathToRoomId } from "@/world/path-to-room";
import { isCvSectionId } from "@/world/scroll-rooms";

const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);
const MIN_RATIO = 0.12;

export function WorldScrollSync() {
  const enabled = useWorldEnabled();
  const pathname = usePathname();
  const setFocusRoom = useWorldStore((s) => s.setFocusRoom);
  const animationPaused = useWorldPaused();
  const rafRef = useRef(0);

  useEffect(() => {
    if (!enabled || animationPaused) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-world-room]"));
    const ratios = new Map<Element, number>();

    const applyBest = () => {
      if (useWorldStore.getState().phase === "traveling") return;
      if (isCvScrollLocked()) return;

      let bestEl: Element | null = null;
      let bestRatio = 0;

      for (const [el, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestEl = el;
        }
      }

      if (!bestEl || bestRatio < MIN_RATIO) return;

      const attr = bestEl.getAttribute("data-world-room");
      if (!attr || !isCvSectionId(attr)) return;

      setFocusRoom(attr);
    };

    if (sections.length === 0) {
      setFocusRoom(pathToRoomId(pathname));
      return;
    }

    const scrollRoot = document.querySelector<HTMLElement>(".cv-world-document");
    const useSnapRoot = scrollRoot && getComputedStyle(scrollRoot).overflowY !== "visible";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio);
        }
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(applyBest);
      },
      {
        root: useSnapRoot ? scrollRoot : null,
        rootMargin: useSnapRoot ? "-12% 0px -12% 0px" : "-28% 0px -28% 0px",
        threshold: THRESHOLDS,
      }
    );

    for (const section of sections) observer.observe(section);

    rafRef.current = requestAnimationFrame(applyBest);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [animationPaused, enabled, pathname, setFocusRoom]);

  return null;
}
