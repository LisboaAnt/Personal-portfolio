"use client";

import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { BLENDER_VIEW_POSITION, BLENDER_VIEW_TARGET } from "@/world/blender-camera";
import { useWorldPaused } from "@/hooks/useWorldPaused";
export function WorldOrbitControls() {
  const { camera, invalidate } = useThree();
  const paused = useWorldPaused();

  useEffect(() => {
    camera.position.set(...BLENDER_VIEW_POSITION);
    camera.lookAt(...BLENDER_VIEW_TARGET);
    invalidate();
  }, [camera, invalidate]);

  return (
    <OrbitControls
      makeDefault
      enabled={false}
      target={BLENDER_VIEW_TARGET}
      enableDamping
      dampingFactor={0.08}
      minDistance={2}
      maxDistance={8000}
      screenSpacePanning
    />
  );
}
