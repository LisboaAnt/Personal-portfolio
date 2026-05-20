"use client";

import { useWorldStore } from "@/stores/world-store";
import { useAnimationPaused } from "./useAnimationPaused";

/** Pausa animações 3D (Snake, separador oculto, reduced motion). */
export function useWorldPaused(): boolean {
  const storePaused = useWorldStore((s) => s.paused);
  const systemPaused = useAnimationPaused();
  return storePaused || systemPaused;
}
