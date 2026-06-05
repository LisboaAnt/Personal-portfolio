"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useAnimationPaused } from "@/hooks/useAnimationPaused";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { useWorldCameraInputStore } from "@/stores/world-camera-input-store";
import { useWorldCameraLookStore } from "@/stores/world-camera-look-store";
import { useWorldCameraTravelStore } from "@/stores/world-camera-travel-store";
import { useWorldEducationStore } from "@/stores/world-education-store";
import { useWorldExperienceStore } from "@/stores/world-experience-store";
import { useWorldStore } from "@/stores/world-store";
import { resolveBlenderCameraPose } from "@/world/blender-section-camera";
import {
  resolveExperienceStageOrbit,
  resolveExperienceStageOrbitStart,
} from "@/world/experience-cameras";
import {
  WORLD_CAMERA_TRAVEL_BLUR_MAX_PX,
  WORLD_EXPERIENCE_JOB_CAMERA_DURATION_S,
  WORLD_EXPERIENCE_ORBIT_SEGMENT_DURATION_S,
  WORLD_EXPERIENCE_STAGE_CAMERA_DURATION_S,
  WORLD_SECTION_CAMERA_DURATION_S,
} from "@/world/constants";
import type { CameraPose, CvSectionId } from "@/world/types";

const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function lerpPose(a: CameraPose, b: CameraPose, t: number): CameraPose {
  _pos.set(...a.position).lerp(_target.set(...b.position), t);
  const target: [number, number, number] = [
    THREE.MathUtils.lerp(a.target[0], b.target[0], t),
    THREE.MathUtils.lerp(a.target[1], b.target[1], t),
    THREE.MathUtils.lerp(a.target[2], b.target[2], t),
  ];
  return {
    position: [_pos.x, _pos.y, _pos.z],
    target,
    fov: THREE.MathUtils.lerp(a.fov ?? 42, b.fov ?? 42, t),
  };
}

function capturePose(
  cam: THREE.PerspectiveCamera,
  lookAt: THREE.Vector3,
): CameraPose {
  return {
    position: [cam.position.x, cam.position.y, cam.position.z],
    target: [lookAt.x, lookAt.y, lookAt.z],
    fov: cam.fov,
  };
}

type Transition = {
  from: CameraPose;
  to: CameraPose;
  t: number;
  duration: number;
  arc: boolean;
  lightingFrom: CvSectionId | null;
  lightingTo: CvSectionId | null;
};

export function WorldBlenderCamera() {
  const { camera, invalidate } = useThree();
  const paused = useWorldPaused();
  const reducedMotion = useAnimationPaused();
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const freeCameraEnabled = useWorldCameraInputStore((s) => s.freeCameraEnabled);
  const orbitPaused = useWorldCameraInputStore((s) => s.orbitPaused);
  const shiftMouse = useWorldCameraInputStore((s) => s.shiftMouse);
  const cameraPoseVersion = useWorldCameraInputStore((s) => s.cameraPoseVersion);
  const setLookTarget = useWorldCameraLookStore((s) => s.setTarget);
  const setTravel = useWorldCameraTravelStore((s) => s.setTravel);
  const activeJobId = useWorldExperienceStore((s) => s.activeJobId);
  const activeStageIndex = useWorldExperienceStore((s) => s.activeStageIndex);
  const activeEducationCardId = useWorldEducationStore((s) => s.activeCardId);
  const setActiveEducationCard = useWorldEducationStore((s) => s.setActiveCard);
  const lookAt = useRef(new THREE.Vector3());
  const transition = useRef<Transition | null>(null);
  const mounted = useRef(false);
  const prevFocusRoom = useRef(focusRoomId);
  const prevJobId = useRef(activeJobId);
  const prevStage = useRef(activeStageIndex);
  const prevEducationCard = useRef(activeEducationCardId);
  const prevPoseVersion = useRef(cameraPoseVersion);
  const orbitSegment = useRef(0);
  const orbitPhase = useRef(0);
  const orbitTravelSynced = useRef(false);

  const beginTransition = (
    to: CameraPose,
    duration: number,
    arc: boolean,
    lightingFrom: CvSectionId | null,
    lightingTo: CvSectionId | null,
  ) => {
    const cam = camera as THREE.PerspectiveCamera;
    transition.current = {
      from: capturePose(cam, lookAt.current),
      to,
      t: 0,
      duration: reducedMotion ? 0.12 : duration,
      arc: arc && !reducedMotion,
      lightingFrom,
      lightingTo,
    };
  };

  useEffect(() => {
    if (focusRoomId !== "education" && activeEducationCardId !== null) {
      setActiveEducationCard(null);
    }
  }, [activeEducationCardId, focusRoomId, setActiveEducationCard]);

  useEffect(() => {
    const to = resolveBlenderCameraPose(
      focusRoomId,
      activeJobId,
      activeStageIndex,
      activeEducationCardId,
    );
    const cam = camera as THREE.PerspectiveCamera;

    const applyPoseNow = (pose: CameraPose) => {
      cam.position.set(...pose.position);
      cam.fov = pose.fov ?? 42;
      cam.updateProjectionMatrix();
      lookAt.current.set(...pose.target);
      cam.lookAt(lookAt.current);
      setLookTarget(...pose.target);
      invalidate();
    };

    if (!mounted.current) {
      mounted.current = true;
      applyPoseNow(to);
      const orbitOnMount = resolveExperienceStageOrbit(activeJobId, activeStageIndex);
      if (focusRoomId === "experience" && orbitOnMount && orbitOnMount.length >= 2) {
        orbitSegment.current = resolveExperienceStageOrbitStart(activeJobId, activeStageIndex);
        orbitPhase.current = 0;
        orbitTravelSynced.current = false;
      }
      prevFocusRoom.current = focusRoomId;
      prevJobId.current = activeJobId;
      prevStage.current = activeStageIndex;
      prevEducationCard.current = activeEducationCardId;
      prevPoseVersion.current = cameraPoseVersion;
      return;
    }

    const poseResync = prevPoseVersion.current !== cameraPoseVersion;
    prevPoseVersion.current = cameraPoseVersion;

    if (poseResync && !freeCameraEnabled) {
      transition.current = null;
      applyPoseNow(to);
      prevFocusRoom.current = focusRoomId;
      prevJobId.current = activeJobId;
      prevStage.current = activeStageIndex;
      prevEducationCard.current = activeEducationCardId;
      return;
    }

    const fromSection = prevFocusRoom.current;
    const sectionChanged = fromSection !== focusRoomId;
    const jobChanged = prevJobId.current !== activeJobId;
    const stageChanged = prevStage.current !== activeStageIndex;
    const educationCardChanged = prevEducationCard.current !== activeEducationCardId;

    prevFocusRoom.current = focusRoomId;
    prevJobId.current = activeJobId;
    prevStage.current = activeStageIndex;
    prevEducationCard.current = activeEducationCardId;

    const orbit = resolveExperienceStageOrbit(activeJobId, activeStageIndex);
    if (focusRoomId === "experience" && orbit && orbit.length >= 2) {
      orbitSegment.current = resolveExperienceStageOrbitStart(activeJobId, activeStageIndex);
      orbitPhase.current = 0;
      orbitTravelSynced.current = false;
    } else {
      orbitTravelSynced.current = false;
    }

    let duration = WORLD_EXPERIENCE_JOB_CAMERA_DURATION_S;
    let arc = false;

    if (sectionChanged) {
      duration = WORLD_SECTION_CAMERA_DURATION_S;
      arc = true;
    } else if (stageChanged || educationCardChanged) {
      duration = WORLD_EXPERIENCE_STAGE_CAMERA_DURATION_S;
    } else if (jobChanged) {
      duration = WORLD_EXPERIENCE_JOB_CAMERA_DURATION_S;
    }

    beginTransition(
      to,
      duration,
      arc,
      sectionChanged ? fromSection : null,
      sectionChanged ? focusRoomId : null,
    );
  }, [
    activeEducationCardId,
    activeJobId,
    activeStageIndex,
    camera,
    cameraPoseVersion,
    focusRoomId,
    freeCameraEnabled,
    invalidate,
    reducedMotion,
    setLookTarget,
  ]);

  useFrame((_, delta) => {
    const userOverridesCamera = freeCameraEnabled && (orbitPaused || shiftMouse);
    if (paused || userOverridesCamera) {
      setTravel({ blurPx: 0, isTraveling: false, progress: 0, lightingFrom: null, lightingTo: null });
      return;
    }

    const cam = camera as THREE.PerspectiveCamera;
    const tr = transition.current;

    if (!tr || tr.t >= 1) {
      const orbit =
        focusRoomId === "experience" && !reducedMotion
          ? resolveExperienceStageOrbit(activeJobId, activeStageIndex)
          : null;

      if (orbit && orbit.length >= 2) {
        let fromIdx = orbitSegment.current % orbit.length;
        let toIdx = (fromIdx + 1) % orbit.length;

        orbitPhase.current += delta / WORLD_EXPERIENCE_ORBIT_SEGMENT_DURATION_S;
        while (orbitPhase.current >= 1) {
          orbitPhase.current -= 1;
          orbitSegment.current = toIdx;
          fromIdx = orbitSegment.current % orbit.length;
          toIdx = (fromIdx + 1) % orbit.length;
        }

        const pose = lerpPose(orbit[fromIdx]!, orbit[toIdx]!, easeInOutSine(orbitPhase.current));
        cam.position.set(...pose.position);
        lookAt.current.set(...pose.target);
        cam.lookAt(lookAt.current);
        const nextFov = pose.fov ?? 42;
        if (Math.abs(cam.fov - nextFov) > 0.01) {
          cam.fov = nextFov;
          cam.updateProjectionMatrix();
        }
        setLookTarget(...pose.target);
        if (!orbitTravelSynced.current) {
          orbitTravelSynced.current = true;
          setTravel({
            blurPx: 0,
            isTraveling: false,
            progress: 1,
            lightingFrom: null,
            lightingTo: null,
          });
        }
        invalidate();
        return;
      }

      const pose = resolveBlenderCameraPose(
        focusRoomId,
        activeJobId,
        activeStageIndex,
        activeEducationCardId,
      );
      cam.position.set(...pose.position);
      lookAt.current.set(...pose.target);
      cam.lookAt(lookAt.current);
      cam.fov = pose.fov ?? 42;
      cam.updateProjectionMatrix();
      setLookTarget(...pose.target);
      setTravel({
        blurPx: 0,
        isTraveling: false,
        progress: 1,
        lightingFrom: null,
        lightingTo: null,
      });
      invalidate();
      return;
    }

    tr.t = Math.min(1, tr.t + delta / tr.duration);
    const e = easeOutCubic(tr.t);

    _pos.set(...tr.from.position).lerp(_target.set(...tr.to.position), e);
    if (tr.arc) {
      _pos.y += Math.sin(e * Math.PI) * 12;
    }

    lookAt.current.set(...tr.from.target).lerp(_target.set(...tr.to.target), e);
    cam.position.copy(_pos);
    cam.lookAt(lookAt.current);
    cam.fov = THREE.MathUtils.lerp(tr.from.fov ?? 42, tr.to.fov ?? 42, e);
    cam.updateProjectionMatrix();
    setLookTarget(lookAt.current.x, lookAt.current.y, lookAt.current.z);

    const blurPx = reducedMotion
      ? 0
      : Math.sin(tr.t * Math.PI) * WORLD_CAMERA_TRAVEL_BLUR_MAX_PX;
    setTravel({
      blurPx,
      isTraveling: tr.t < 0.98,
      progress: e,
      lightingFrom: tr.lightingFrom,
      lightingTo: tr.lightingTo,
    });

    invalidate();

    if (tr.t >= 1) transition.current = null;
  });

  return null;
}
