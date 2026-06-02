"use client";

import { useProgress } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { useWorldPosterStore } from "@/stores/world-poster-store";
import {
  isWorldWallpaperEnabled,
  WORLD_WALLPAPER_READY_HOLD_MS,
} from "@/world/world-wallpaper";

/** Marca o mundo 3D como pronto (GLB + primeiro frame estável). */
export function WorldLoadNotifier() {
  const { active, progress } = useProgress();
  const invalidate = useThree((s) => s.invalidate);
  const setSceneReady = useWorldPosterStore((s) => s.setSceneReady);

  useEffect(() => {
    if (!isWorldWallpaperEnabled()) return;
    if (active || progress < 100) return;

    invalidate();
    let inner = 0;
    let holdTimer = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        holdTimer = window.setTimeout(
          () => setSceneReady(true),
          WORLD_WALLPAPER_READY_HOLD_MS,
        );
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      window.clearTimeout(holdTimer);
    };
  }, [active, progress, invalidate, setSceneReady]);

  return null;
}
