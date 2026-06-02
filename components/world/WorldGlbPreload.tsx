"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { BLENDER_SCENE_URL } from "@/world/blender-scene";
import { isBlenderWorldScene } from "@/world/world-scene-mode";

/** Dispara o fetch do GLB o mais cedo possível (antes do chunk do Canvas). */
export function WorldGlbPreload() {
  useEffect(() => {
    if (!isBlenderWorldScene()) return;
    useGLTF.preload(BLENDER_SCENE_URL);
  }, []);

  return null;
}
