"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { getBlenderLightingFromEnv } from "@/world/blender-lighting-env";

/** Fundo sólido tipo Sketchfab (ex. azul noturno #2c3e50). */
export function WorldBlenderBackground() {
  const scene = useThree((s) => s.scene);
  const hex = getBlenderLightingFromEnv().sceneBackground;

  useEffect(() => {
    const prev = scene.background;
    if (hex) {
      scene.background = new THREE.Color(hex);
    }
    return () => {
      scene.background = prev;
    };
  }, [hex, scene]);

  return null;
}
