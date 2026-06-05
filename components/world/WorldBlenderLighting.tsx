"use client";

import { Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useWorldCameraTravelStore } from "@/stores/world-camera-travel-store";
import { useWorldStore } from "@/stores/world-store";
import { getBlenderLightingFromEnv } from "@/world/blender-lighting-env";
import {
  lerpSectionLighting,
  resolveSectionLighting,
  type ResolvedSectionLighting,
} from "@/world/cv-section-lighting";
const LIGHT_LERP_SPEED = 2.4;

function cloneLightingState(src: ResolvedSectionLighting) {
  return {
    environmentIntensity: src.environmentIntensity,
    ambientIntensity: src.ambientIntensity,
    directionalIntensity: src.directionalIntensity,
    toneMappingExposure: src.toneMappingExposure,
    ambientColor: src.ambientColor.clone(),
    directionalColor: src.directionalColor.clone(),
  };
}

/** Luzes React + HDR; intensidades seguem a viagem da câmara entre secções. */
export function WorldBlenderLighting() {
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const travelProgress = useWorldCameraTravelStore((s) => s.progress);
  const lightingFrom = useWorldCameraTravelStore((s) => s.lightingFrom);
  const lightingTo = useWorldCameraTravelStore((s) => s.lightingTo);
  const isTraveling = useWorldCameraTravelStore((s) => s.isTraveling);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);

  const base = getBlenderLightingFromEnv();
  const currentRef = useRef(cloneLightingState(resolveSectionLighting("profile")));

  const ambRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);

  useFrame((_, dt) => {
    const cur = currentRef.current;

    let target: ResolvedSectionLighting;
    if (
      isTraveling &&
      lightingFrom &&
      lightingTo &&
      lightingFrom !== lightingTo
    ) {
      target = lerpSectionLighting(lightingFrom, lightingTo, travelProgress);
    } else {
      target = resolveSectionLighting(focusRoomId);
    }

    const t = 1 - Math.exp(-LIGHT_LERP_SPEED * dt);
    cur.environmentIntensity = THREE.MathUtils.lerp(
      cur.environmentIntensity,
      target.environmentIntensity,
      t,
    );
    cur.ambientIntensity = THREE.MathUtils.lerp(cur.ambientIntensity, target.ambientIntensity, t);
    cur.directionalIntensity = THREE.MathUtils.lerp(
      cur.directionalIntensity,
      target.directionalIntensity,
      t,
    );
    cur.toneMappingExposure = THREE.MathUtils.lerp(
      cur.toneMappingExposure,
      target.toneMappingExposure,
      t,
    );
    cur.ambientColor.lerp(target.ambientColor, t);
    cur.directionalColor.lerp(target.directionalColor, t);

    if (ambRef.current) {
      ambRef.current.intensity = cur.ambientIntensity;
      ambRef.current.color.copy(cur.ambientColor);
    }
    if (dirRef.current) {
      dirRef.current.intensity = cur.directionalIntensity;
      dirRef.current.color.copy(cur.directionalColor);
    }

    if (base.environmentEnabled) {
      scene.environmentIntensity = cur.environmentIntensity;
    }

    gl.toneMappingExposure = cur.toneMappingExposure;
    invalidate();
  });

  const init = currentRef.current;

  return (
    <>
      {base.environmentEnabled ? (
        <Environment
          preset="studio"
          background={false}
          environmentIntensity={init.environmentIntensity}
        />
      ) : null}
      <ambientLight ref={ambRef} intensity={init.ambientIntensity} color={init.ambientColor} />
      <directionalLight
        ref={dirRef}
        position={[40, 60, 30]}
        intensity={init.directionalIntensity}
        color={init.directionalColor}
      />
    </>
  );
}
