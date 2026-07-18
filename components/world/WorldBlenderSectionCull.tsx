"use client";

import type { Object3D } from "three";
import { useFrame } from "@react-three/fiber";
import { useWorldQuality } from "@/hooks/useWorldQuality";
import { useWorldCameraTravelStore } from "@/stores/world-camera-travel-store";
import { useWorldStore } from "@/stores/world-store";
import { applyBlenderSectionCull } from "@/world/blender-section-cull";
import { getWorldSceneCullRadius } from "@/world/world-render-env";

type Props = { scene: Object3D };

/** Esconde geometria longe da secção CV activa para reduzir triângulos no GPU. */
export function WorldBlenderSectionCull({ scene }: Props) {
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const isTraveling = useWorldCameraTravelStore((s) => s.isTraveling);
  const lightingTo = useWorldCameraTravelStore((s) => s.lightingTo);
  const quality = useWorldQuality();

  useFrame(() => {
    let radius = getWorldSceneCullRadius(quality);
    if (!Number.isFinite(radius)) return;
    if (isTraveling) radius *= 1.75;
    const secondary =
      isTraveling && lightingTo && lightingTo !== focusRoomId ? lightingTo : null;
    applyBlenderSectionCull(scene, focusRoomId, radius, secondary);
  });

  return null;
}
