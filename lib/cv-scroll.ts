import type { CvSectionId } from "@/world/types";

let cvScrollLockUntil = 0;

export function isCvScrollLocked(): boolean {
  return typeof performance !== "undefined" && performance.now() < cvScrollLockUntil;
}

function lockCvScroll(ms = 420) {
  if (typeof performance === "undefined") return;
  cvScrollLockUntil = performance.now() + ms;
}

export function getCvSectionScrollTop(root: HTMLElement, section: HTMLElement): number {
  const rootRect = root.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();
  return sectionRect.top - rootRect.top + root.scrollTop;
}

export function resolveCvSnapScrollTop(root: HTMLElement, sections: HTMLElement[]): number {
  if (sections.length === 0) return root.scrollTop;

  const tops = sections.map((section) => getCvSectionScrollTop(root, section));
  const scrollTop = root.scrollTop;

  if (scrollTop <= tops[0]! + 2) return tops[0]!;
  const lastTop = tops[tops.length - 1]!;
  if (scrollTop >= lastTop - 2) return lastTop;

  for (let i = 0; i < tops.length - 1; i++) {
    const start = tops[i]!;
    const end = tops[i + 1]!;
    if (scrollTop >= start && scrollTop < end) {
      const mid = (start + end) / 2;
      return scrollTop < mid ? start : end;
    }
  }

  return tops[0]!;
}

export function getCvScrollRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const root = document.querySelector<HTMLElement>(".cv-world-document");
  if (!root) return null;
  const { overflowY } = getComputedStyle(root);
  if (overflowY === "visible" || overflowY === "hidden") return null;
  return root;
}

type CvScrollBehavior = ScrollBehavior | "instant";

function normalizeScrollBehavior(behavior: CvScrollBehavior): ScrollBehavior {
  return behavior === "instant" ? "auto" : behavior;
}

export function scrollToCvSection(
  id: CvSectionId | string,
  behavior: CvScrollBehavior = "smooth",
) {
  const el = document.getElementById(id);
  if (!el) return;

  const scrollBehavior = normalizeScrollBehavior(behavior);
  const root = getCvScrollRoot();

  if (!root) {
    el.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    return;
  }

  const rootRect = root.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const top = elRect.top - rootRect.top + root.scrollTop;

  lockCvScroll(scrollBehavior === "smooth" ? 520 : 120);
  root.scrollTo({ top, behavior: scrollBehavior });
}
