"use client";

import { CameraRig } from "./CameraRig";
import { WorldBlenderScene } from "./WorldBlenderScene";
import { WorldCameraDebugSync } from "./WorldCameraDebugSync";
import { WorldFreeCameraControls } from "./WorldFreeCameraControls";
import { WorldBlenderCamera } from "./WorldBlenderCamera";
import { WorldEnvironment } from "./WorldEnvironment";
import { WorldIsland } from "./WorldIsland";
import { WorldBlenderDemandInvalidate } from "./WorldBlenderDemandInvalidate";
import { WorldBlenderLighting } from "./WorldBlenderLighting";
import { WorldRendererSync } from "./WorldRendererSync";
import { WorldLighting } from "./WorldLighting";
import { WorldPerfSync } from "./WorldPerfSync";
import { CV_SECTIONS, getCvSectionCamera } from "@/world/cv-sections";
import { isBlenderWorldScene } from "@/world/world-scene-mode";
import { useWorldStore } from "@/stores/world-store";
import { useWorldNavigate } from "@/hooks/useWorldNavigate";
import {
  WORLD_CAMERA_DURATION_S,
  WORLD_REDUCED_CAMERA_DURATION_S,
  WORLD_SCROLL_CAMERA_DURATION_S,
} from "@/world/constants";
import { useAnimationPaused } from "@/hooks/useAnimationPaused";
import type { CvSectionId } from "@/world/types";

export function WorldScene() {
  const blenderScene = isBlenderWorldScene();
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const cameraMode = useWorldStore((s) => s.cameraMode);
  const { goToSection } = useWorldNavigate();
  const reducedMotion = useAnimationPaused();
  const cameraPose = getCvSectionCamera(focusRoomId);
  const cameraDuration = reducedMotion
    ? WORLD_REDUCED_CAMERA_DURATION_S
    : cameraMode === "scroll"
      ? WORLD_SCROLL_CAMERA_DURATION_S
      : WORLD_CAMERA_DURATION_S;

  const handleSelect = (id: CvSectionId) => {
    goToSection(id);
  };

  return (
    <>
      <WorldEnvironment minimal={blenderScene} transparent={blenderScene} />
      {blenderScene ? (
        <>
          <WorldRendererSync />
          <WorldBlenderDemandInvalidate />
          <WorldBlenderLighting />
        </>
      ) : (
        <WorldLighting />
      )}

      {blenderScene ? (
        <WorldBlenderScene />
      ) : (
        CV_SECTIONS.map((section) => (
          <WorldIsland
            key={section.id}
            config={section}
            active={focusRoomId === section.id}
            onSelect={() => handleSelect(section.id)}
          />
        ))
      )}

      {blenderScene ? (
        <>
          <WorldBlenderCamera />
          <WorldFreeCameraControls />
          <WorldCameraDebugSync />
          <WorldPerfSync />
        </>
      ) : (
        <CameraRig
          pose={cameraPose}
          duration={cameraDuration}
          arc={cameraMode === "scroll" && !reducedMotion}
        />
      )}
    </>
  );
}
