import type { CvSectionId } from "@/world/types";

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

  root.scrollTo({ top, behavior: scrollBehavior });
}
