"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useAnimationPaused } from "@/hooks/useAnimationPaused";
import { useWorldCameraTravelStore } from "@/stores/world-camera-travel-store";
import { WORLD_TRAVEL_DPR_RESTORE_DELAY_MS, WORLD_TRAVEL_RENDER_FPS } from "@/world/constants";

/** Invalidates throttled durante viagem — com frameloop «demand» limita o WebGL a ~30 FPS. */
export function WorldTravelRenderLimiter() {
  const isTraveling = useWorldCameraTravelStore((s) => s.isTraveling);
  const blurPx = useWorldCameraTravelStore((s) => s.blurPx);
  const invalidate = useThree((s) => s.invalidate);
  const reducedMotion = useAnimationPaused();
  const restoreInvalidateRef = useRef(0);

  const budgetActive = isTraveling || blurPx > 0.02;

  useEffect(() => {
    if (!budgetActive || reducedMotion) {
      if (restoreInvalidateRef.current) {
        window.clearTimeout(restoreInvalidateRef.current);
      }
      restoreInvalidateRef.current = window.setTimeout(() => {
        invalidate();
        restoreInvalidateRef.current = 0;
      }, WORLD_TRAVEL_DPR_RESTORE_DELAY_MS + 16);
      return () => {
        if (restoreInvalidateRef.current) {
          window.clearTimeout(restoreInvalidateRef.current);
          restoreInvalidateRef.current = 0;
        }
      };
    }

    const intervalMs = 1000 / WORLD_TRAVEL_RENDER_FPS;
    let raf = 0;
    let last = 0;

    invalidate();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < intervalMs) return;
      last = now;
      invalidate();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [blurPx, budgetActive, invalidate, reducedMotion]);

  return null;
}
