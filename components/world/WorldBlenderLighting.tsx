"use client";

import { Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useWorldStore } from "@/stores/world-store";
import { getBlenderLightingFromEnv } from "@/world/blender-lighting-env";
import {
  resolveSectionLighting,
  type ResolvedSectionLighting,
} from "@/world/cv-section-lighting";

const LERP_SPEED = 5;

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

/** Luzes React + HDR; intensidades mudam ao trocar de secção CV (`focusRoomId`). */
export function WorldBlenderLighting() {
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);

  const base = getBlenderLightingFromEnv();
  const targetRef = useRef(resolveSectionLighting("profile"));
  const currentRef = useRef(cloneLightingState(targetRef.current));

  const ambRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    targetRef.current = resolveSectionLighting(focusRoomId);
  }, [focusRoomId]);

  useFrame((_, dt) => {
    const t = 1 - Math.exp(-LERP_SPEED * dt);
    const cur = currentRef.current;
    const tgt = targetRef.current;

    cur.environmentIntensity = THREE.MathUtils.lerp(cur.environmentIntensity, tgt.environmentIntensity, t);
    cur.ambientIntensity = THREE.MathUtils.lerp(cur.ambientIntensity, tgt.ambientIntensity, t);
    cur.directionalIntensity = THREE.MathUtils.lerp(
      cur.directionalIntensity,
      tgt.directionalIntensity,
      t
    );
    cur.toneMappingExposure = THREE.MathUtils.lerp(
      cur.toneMappingExposure,
      tgt.toneMappingExposure,
      t
    );
    cur.ambientColor.lerp(tgt.ambientColor, t);
    cur.directionalColor.lerp(tgt.directionalColor, t);

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
