import type { CvSectionId } from "@/world/types";

let cvScrollLockUntil = 0;

export function isCvScrollLocked(): boolean {
  return typeof performance !== "undefined" && performance.now() < cvScrollLockUntil;
}

function lockCvScroll(ms = 420) {
  if (typeof performance === "undefined") return;
  cvScrollLockUntil = performance.now() + ms;
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
