"use client";

import { useEffect } from "react";
import { isCvScrollLocked } from "@/lib/cv-scroll";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";

function getSectionScrollTop(root: HTMLElement, section: HTMLElement): number {
  const rootRect = root.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();
  return sectionRect.top - rootRect.top + root.scrollTop;
}

function snapToNearestSection(root: HTMLElement) {
  if (isCvScrollLocked()) return;

  const sections = Array.from(root.querySelectorAll<HTMLElement>(".cv-snap-section"));
  if (sections.length === 0) return;

  const scrollTop = root.scrollTop;
  let nearest = sections[0]!;
  let nearestDist = Math.abs(getSectionScrollTop(root, nearest) - scrollTop);

  for (const section of sections) {
    const top = getSectionScrollTop(root, section);
    const dist = Math.abs(top - scrollTop);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = section;
    }
  }

  const targetTop = getSectionScrollTop(root, nearest);
  if (nearestDist <= 2) return;

  root.scrollTo({
    top: targetTop,
    behavior: nearestDist < 48 ? "auto" : "smooth",
  });
}

/** Reforça o snap CSS — impede parar entre secções. */
export function CvScrollSnapEnhancer() {
  const enabled = useWorldEnabled();

  useEffect(() => {
    if (!enabled) return;

    const root = document.querySelector<HTMLElement>(".cv-world-document");
    if (!root) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;

    const scheduleSnap = () => {
      if (isCvScrollLocked()) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => snapToNearestSection(root), 72);
    };

    const onScrollEnd = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => snapToNearestSection(root));
    };

    root.addEventListener("scroll", scheduleSnap, { passive: true });
    root.addEventListener("scrollend", onScrollEnd);
    root.addEventListener("touchend", scheduleSnap, { passive: true });
    root.addEventListener("pointerup", scheduleSnap, { passive: true });

    return () => {
      if (timer) clearTimeout(timer);
      cancelAnimationFrame(raf);
      root.removeEventListener("scroll", scheduleSnap);
      root.removeEventListener("scrollend", onScrollEnd);
      root.removeEventListener("touchend", scheduleSnap);
      root.removeEventListener("pointerup", scheduleSnap);
    };
  }, [enabled]);

  return null;
}
