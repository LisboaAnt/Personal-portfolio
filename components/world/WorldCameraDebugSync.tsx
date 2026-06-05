"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { useWorldCameraDebugStore } from "@/stores/world-camera-debug-store";
import { useWorldCameraLookStore } from "@/stores/world-camera-look-store";

const LOOK_AHEAD = 80;

const _euler = new THREE.Euler();
const _dir = new THREE.Vector3();
const _storedTarget = new THREE.Vector3();

/** Alvo que recria a vista actual com position + target + lookAt (ignora rotação do HUD). */
function recreationTarget(
  cam: THREE.PerspectiveCamera,
  stored: [number, number, number],
): [number, number, number] {
  _storedTarget.set(stored[0], stored[1], stored[2]);
  cam.getWorldDirection(_dir);

  let dist = cam.position.distanceTo(_storedTarget);
  if (!Number.isFinite(dist) || dist < 0.01) dist = LOOK_AHEAD;

  return [
    cam.position.x + _dir.x * dist,
    cam.position.y + _dir.y * dist,
    cam.position.z + _dir.z * dist,
  ];
}

export function WorldCameraDebugSync() {
  const setSnapshot = useWorldCameraDebugStore((s) => s.setSnapshot);
  const lookTarget = useWorldCameraLookStore((s) => s.target);
  const { camera } = useThree();

  useEffect(() => {
    return () => {
      setSnapshot({
        position: [0, 0, 0],
        target: [0, 0, 0],
        rotationDeg: [0, 0, 0],
        fov: 42,
      });
    };
  }, [setSnapshot]);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aim = recreationTarget(cam, lookTarget);

    _euler.setFromQuaternion(cam.quaternion, "XYZ");
    const toDeg = THREE.MathUtils.radToDeg;

    setSnapshot({
      position: [cam.position.x, cam.position.y, cam.position.z],
      target: aim,
      rotationDeg: [toDeg(_euler.x), toDeg(_euler.y), toDeg(_euler.z)],
      fov: cam.fov,
    });
  });

  return null;
}
