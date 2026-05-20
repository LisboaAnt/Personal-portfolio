"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { SKETCH_SCENE_URL } from "@/world/sketch-scene";
import { getSketchTransformFromEnv } from "@/world/sketch-transform-env";
import { fixTiltBrushMaterials } from "@/world/tilt-brush-materials";

useGLTF.preload(SKETCH_SCENE_URL);

export function WorldSketchScene() {
  const { scene: cachedScene } = useGLTF(SKETCH_SCENE_URL);
  const transform = getSketchTransformFromEnv();

  const scene = useMemo(() => cachedScene.clone(true), [cachedScene]);

  useEffect(() => {
    fixTiltBrushMaterials(scene);
  }, [scene]);

  return (
    <group
      position={transform.position}
      rotation={transform.rotation.map((d) => (d * Math.PI) / 180) as [number, number, number]}
      scale={transform.scale}
    >
      <primitive object={scene} />
    </group>
  );
}
