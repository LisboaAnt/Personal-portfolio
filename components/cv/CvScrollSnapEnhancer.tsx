"use client";

import { useEffect } from "react";
import {
  isCvScrollLocked,
  resolveCvSnapScrollTop,
} from "@/lib/cv-scroll";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";

const SNAP_MQ = "(min-width: 1024px)";

function snapToNearestSection(root: HTMLElement) {
  if (isCvScrollLocked()) return;
  if (typeof window !== "undefined" && !window.matchMedia(SNAP_MQ).matches) return;

  const sections = Array.from(root.querySelectorAll<HTMLElement>(".cv-snap-section"));
  if (sections.length === 0) return;

  const scrollTop = root.scrollTop;
  const targetTop = resolveCvSnapScrollTop(root, sections);
  const nearestDist = Math.abs(targetTop - scrollTop);

  if (nearestDist <= 2) return;

  root.scrollTo({
    top: targetTop,
    behavior: nearestDist < 48 ? "auto" : "smooth",
  });
}

/** Reforça o snap CSS — impede parar entre secções (só desktop ≥ lg). */
export function CvScrollSnapEnhancer() {
  const enabled = useWorldEnabled();

  useEffect(() => {
    if (!enabled) return;

    const root = document.querySelector<HTMLElement>(".cv-world-document");
    if (!root) return;

    const mq = window.matchMedia(SNAP_MQ);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;

    const scheduleSnap = () => {
      if (!mq.matches || isCvScrollLocked()) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => snapToNearestSection(root), 72);
    };

    const onScrollEnd = () => {
      if (!mq.matches || isCvScrollLocked()) return;
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
