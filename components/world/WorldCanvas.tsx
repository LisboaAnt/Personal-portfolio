"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, type CSSProperties } from "react";
import * as THREE from "three";
import { SpikeScene } from "./SpikeScene";
import { WorldGlbLoader } from "./WorldGlbLoader";
import { WorldLoadNotifier } from "./WorldLoadNotifier";
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
  WORLD_SECTION_CAMERA_DURATION_S,
} from "@/world/constants";
import { BLENDER_VIEW_FOV, BLENDER_VIEW_POSITION } from "@/world/blender-camera";
import { getBlenderLightingFromEnv } from "@/world/blender-lighting-env";
import { isWorldPosterCaptureEnabled } from "@/world/world-poster-capture";
import { isWorldWallpaperEnabled } from "@/world/world-wallpaper";
import { useWorldPosterStore } from "@/stores/world-poster-store";
import { useWorldCameraTravelStore } from "@/stores/world-camera-travel-store";

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
  const isTraveling = useWorldCameraTravelStore((s) => s.isTraveling);
  const paused = useWorldPaused();

  useEffect(() => {
    if (paused) return;
    invalidate();
    const durationMs =
      (isTraveling
        ? WORLD_SECTION_CAMERA_DURATION_S
        : cameraMode === "scroll"
          ? WORLD_SCROLL_CAMERA_DURATION_S
          : WORLD_CAMERA_DURATION_S) *
        1000 +
      120;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      invalidate();
      if (now - start < durationMs) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cameraMode, focusRoomId, invalidate, isTraveling, paused, phase]);

  return null;
}

export function WorldCanvas({ className, scene = "site" }: Props) {
  const showLoader = scene === "site";
  const quality = useWorldQuality();
  const paused = useWorldPaused();
  const blenderScene = scene === "site" && isBlenderWorldScene();
  const frameloop = paused ? "never" : blenderScene ? "always" : "demand";
  const posterCapture = blenderScene && isWorldPosterCaptureEnabled();
  const wallpaperActive =
    blenderScene && isWorldWallpaperEnabled() && useWorldPosterStore((s) => !s.sceneReady);
  const blurPx = useWorldCameraTravelStore((s) => s.blurPx);
  const isTraveling = useWorldCameraTravelStore((s) => s.isTraveling);

  return (
    <div
      className={`${className ?? "absolute inset-0"} ${blenderScene ? "world-canvas-orbit pointer-events-auto" : ""} ${blenderScene && isTraveling && blurPx > 0 ? "world-canvas-traveling" : ""}`}
      style={
        blenderScene && blurPx > 0
          ? ({ "--world-travel-blur": `${blurPx}px` } as CSSProperties)
          : undefined
      }
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
          preserveDrawingBuffer: posterCapture,
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
        {scene === "site" && blenderScene && isWorldWallpaperEnabled() ? (
          <WorldLoadNotifier />
        ) : null}
      </Canvas>
      {showLoader && !wallpaperActive ? <WorldGlbLoader /> : null}
    </div>
  );
}
