"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import {
  BLENDER_ORBIT_ELEVATION,
  BLENDER_ORBIT_INITIAL_ANGLE,
  BLENDER_ORBIT_RADIUS,
  BLENDER_ORBIT_SPEED,
  BLENDER_ORBIT_LOOK_Y_OFFSET,
  BLENDER_ORBIT_TARGET,
  BLENDER_VIEW_FOV,
} from "@/world/blender-camera";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { useWorldCameraInputStore } from "@/stores/world-camera-input-store";
import { useWorldCameraLookStore } from "@/stores/world-camera-look-store";

const _target = new THREE.Vector3();

export function WorldOrbitCamera() {
  const { camera, invalidate } = useThree();
  const paused = useWorldPaused();
  const orbitPaused = useWorldCameraInputStore((s) => s.orbitPaused);
  const shiftMouse = useWorldCameraInputStore((s) => s.shiftMouse);
  const setLookTarget = useWorldCameraLookStore((s) => s.setTarget);
  const angle = useRef(BLENDER_ORBIT_INITIAL_ANGLE);
  const wasManual = useRef(false);

  useFrame((_, delta) => {
    if (paused || orbitPaused || shiftMouse) {
      wasManual.current = true;
      return;
    }

    if (wasManual.current) {
      wasManual.current = false;
      _target.set(...BLENDER_ORBIT_TARGET);
      angle.current = Math.atan2(
        camera.position.x - _target.x,
        camera.position.z - _target.z,
      );
    }

    angle.current += BLENDER_ORBIT_SPEED * delta;

    const cam = camera as THREE.PerspectiveCamera;
    _target.set(...BLENDER_ORBIT_TARGET);
    _target.y += BLENDER_ORBIT_LOOK_Y_OFFSET;

    const horiz = BLENDER_ORBIT_RADIUS * Math.cos(BLENDER_ORBIT_ELEVATION);
    const centerY = BLENDER_ORBIT_TARGET[1];
    cam.position.set(
      BLENDER_ORBIT_TARGET[0] + horiz * Math.sin(angle.current),
      centerY + BLENDER_ORBIT_RADIUS * Math.sin(BLENDER_ORBIT_ELEVATION),
      BLENDER_ORBIT_TARGET[2] + horiz * Math.cos(angle.current),
    );
    cam.lookAt(_target);
    cam.fov = BLENDER_VIEW_FOV;
    cam.updateProjectionMatrix();
    setLookTarget(_target.x, _target.y, _target.z);
    invalidate();
  });

  return null;
}
