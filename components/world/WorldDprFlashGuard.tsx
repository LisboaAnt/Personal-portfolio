"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";
import { useWorldQuality } from "@/hooks/useWorldQuality";
import { useWorldEducationQualityStore } from "@/stores/world-education-quality-store";
import { getWorldCanvasDpr } from "@/world/world-render-env";

/**
 * Aplica o DPR do boost Education e renderiza no mesmo layout tick.
 * O `dpr` do Canvas fica na base (sem boost) para o R3F não fazer
 * setDpr num useEffect depois do paint — isso é o que piscava preto.
 */
export function WorldDprFlashGuard() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const setDpr = useThree((s) => s.setDpr);
  const invalidate = useThree((s) => s.invalidate);
  const quality = useWorldQuality();
  const boost = useWorldEducationQualityStore((s) => s.boost);
  const lastKey = useRef("");

  useLayoutEffect(() => {
    const next = getWorldCanvasDpr(quality, boost);
    const key = Array.isArray(next) ? `${quality}:${next.join(",")}` : `${quality}:${next}`;
    if (key === lastKey.current) return;
    lastKey.current = key;

    setDpr(next);
    gl.render(scene, camera);
    invalidate();
  }, [boost, camera, gl, invalidate, quality, scene, setDpr]);

  return null;
}
