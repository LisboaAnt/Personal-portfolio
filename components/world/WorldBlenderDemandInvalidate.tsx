"use client";

import type { Object3D } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGlbAnimationsEnabled } from "@/hooks/useGlbAnimationsEnabled";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { useWorldCameraTravelStore } from "@/stores/world-camera-travel-store";
import { useWorldStore } from "@/stores/world-store";

/** Com `frameloop="demand"`, pede frames quando a cena anima ou viaja. */
export function WorldBlenderDemandInvalidate() {
  const invalidate = useThree((s) => s.invalidate);
  const paused = useWorldPaused();
  const isTraveling = useWorldCameraTravelStore((s) => s.isTraveling);
  const animationsEnabled = useGlbAnimationsEnabled();
  const focusRoomId = useWorldStore((s) => s.focusRoomId);

  useFrame(() => {
    if (paused) return;
    if (isTraveling || animationsEnabled || focusRoomId === "experience" || focusRoomId === "education") {
      invalidate();
    }
  });

  return null;
}
