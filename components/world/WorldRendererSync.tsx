"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { getBlenderLightingFromEnv } from "@/world/blender-lighting-env";

/** Configura tone mapping ACES no renderer (exposição é animada em `WorldBlenderLighting`). */
export function WorldRendererSync() {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const { toneMappingExposure } = getBlenderLightingFromEnv();
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = toneMappingExposure;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    invalidate();
  }, [gl, invalidate]);

  return null;
}
