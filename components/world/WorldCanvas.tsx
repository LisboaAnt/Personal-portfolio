"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { SpikeScene } from "./SpikeScene";
import { WorldScene } from "./WorldScene";
import { useWorldQuality } from "@/hooks/useWorldQuality";
import { isBlenderWorldScene } from "@/world/world-scene-mode";
import { useWorldStore } from "@/stores/world-store";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import {
  WORLD_CAMERA_DURATION_S,
  WORLD_CAMERA_FAR_BLENDER,
  WORLD_CAMERA_FAR_CODE,
  WORLD_SCROLL_CAMERA_DURATION_S,
} from "@/world/constants";
import { BLENDER_VIEW_FOV, BLENDER_VIEW_POSITION } from "@/world/blender-camera";
import { getBlenderLightingFromEnv } from "@/world/blender-lighting-env";

type Props = {
  className?: string;
  scene?: "spike" | "site";
};

function SceneFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshBasicMaterial color="#818cf8" wireframe />
    </mesh>
  );
}

function FrameDriver() {
  const invalidate = useThree((s) => s.invalidate);
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const phase = useWorldStore((s) => s.phase);
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const paused = useWorldPaused();

  useEffect(() => {
    if (paused) return;
    invalidate();
    const durationMs =
      (cameraMode === "scroll" ? WORLD_SCROLL_CAMERA_DURATION_S : WORLD_CAMERA_DURATION_S) * 1000 +
      80;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      invalidate();
      if (now - start < durationMs) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cameraMode, focusRoomId, invalidate, paused, phase]);

  return null;
}

export function WorldCanvas({ className, scene = "site" }: Props) {
  const showLoader = scene === "site";
  const quality = useWorldQuality();
  const paused = useWorldPaused();
  const blenderScene = scene === "site" && isBlenderWorldScene();
  const frameloop = paused ? "never" : blenderScene ? "always" : "demand";

  return (
    <div
      className={`${className ?? "absolute inset-0"} ${blenderScene ? "world-canvas-orbit pointer-events-auto" : ""}`}
      aria-hidden
    >
      <Canvas
        camera={{
          position: blenderScene ? BLENDER_VIEW_POSITION : [0, 5, 14],
          fov: blenderScene ? BLENDER_VIEW_FOV : 42,
          near: 0.1,
          far: blenderScene ? WORLD_CAMERA_FAR_BLENDER : WORLD_CAMERA_FAR_CODE,
        }}
        dpr={quality === "low" ? 1 : [1, 1.5]}
        frameloop={frameloop}
        gl={{
          antialias: quality === "high",
          alpha: blenderScene,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          if (!blenderScene) return;
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = getBlenderLightingFromEnv().toneMappingExposure;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={<SceneFallback />}>
          {scene === "spike" ? <SpikeScene /> : <WorldScene />}
        </Suspense>
        {scene === "site" ? <FrameDriver /> : null}
      </Canvas>
      {showLoader ? (
        <Loader
          containerStyles={{ background: "transparent", pointerEvents: "none", zIndex: 15 }}
          barStyles={{ background: "var(--accent)", height: 3 }}
          dataInterpolation={(p) => `A carregar ${p.toFixed(0)}%`}
        />
      ) : null}
    </div>
  );
}
