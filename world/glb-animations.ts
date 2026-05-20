/** Animações do `blender.glb` — `NEXT_PUBLIC_WORLD_GLB_ANIM=0` desliga todas. */
export function isGlbAnimationEnvEnabled(): boolean {
  return process.env.NEXT_PUBLIC_WORLD_GLB_ANIM !== "0";
}

/** `NEXT_PUBLIC_WORLD_GLB_ANIM_MOBILE=0` desliga animações em viewports ≤768px. */
export function isGlbAnimationBlockedOnMobile(): boolean {
  if (process.env.NEXT_PUBLIC_WORLD_GLB_ANIM_MOBILE === "1") return false;
  if (process.env.NEXT_PUBLIC_WORLD_GLB_ANIM_MOBILE === "0") {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 768px)").matches;
  }
  return false;
}
