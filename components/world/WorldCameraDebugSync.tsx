"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { useWorldCameraDebugStore } from "@/stores/world-camera-debug-store";
import { useWorldCameraLookStore } from "@/stores/world-camera-look-store";

const _euler = new THREE.Euler();
const _target = new THREE.Vector3();

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
    _target.set(lookTarget[0], lookTarget[1], lookTarget[2]);

    _euler.setFromQuaternion(cam.quaternion, "XYZ");
    const toDeg = THREE.MathUtils.radToDeg;

    setSnapshot({
      position: [cam.position.x, cam.position.y, cam.position.z],
      target: [_target.x, _target.y, _target.z],
      rotationDeg: [toDeg(_euler.x), toDeg(_euler.y), toDeg(_euler.z)],
      fov: cam.fov,
    });
  });

  return null;
}
