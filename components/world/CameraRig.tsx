"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { CameraPose } from "@/world/types";

const _target = new THREE.Vector3();
const _pos = new THREE.Vector3();

type Props = {
  pose: CameraPose;
  duration?: number;
  /** Pequeno arco vertical ao deslocar (scroll entre salas) */
  arc?: boolean;
  onComplete?: () => void;
};

export function CameraRig({ pose, duration = 1.15, arc = false, onComplete }: Props) {
  const { camera } = useThree();
  const from = useRef({ pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 45 });
  const to = useRef({ pos: new THREE.Vector3(), target: new THREE.Vector3(), fov: 45 });
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const t = useRef(1);
  const mounted = useRef(false);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (!mounted.current) {
      mounted.current = true;
      cam.position.set(...pose.position);
      cam.fov = pose.fov ?? cam.fov;
      cam.updateProjectionMatrix();
      lookAt.current.set(...pose.target);
      cam.lookAt(lookAt.current);
      t.current = 1;
      return;
    }

    from.current.pos.copy(cam.position);
    from.current.target.copy(lookAt.current);
    from.current.fov = cam.fov;

    to.current.pos.set(...pose.position);
    to.current.target.set(...pose.target);
    to.current.fov = pose.fov ?? cam.fov;
    t.current = 0;
  }, [camera, pose]);

  useFrame((_, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    if (t.current >= 1) return;

    const speed = duration > 0 ? 1 / duration : 10;
    t.current = Math.min(1, t.current + delta * speed);
    const e = 1 - Math.pow(1 - t.current, 3);

    _pos.lerpVectors(from.current.pos, to.current.pos, e);
    if (arc) {
      _pos.y += Math.sin(e * Math.PI) * 0.85;
    }
    _target.lerpVectors(from.current.target, to.current.target, e);
    cam.position.copy(_pos);
    cam.fov = THREE.MathUtils.lerp(from.current.fov, to.current.fov, e);
    cam.updateProjectionMatrix();
    lookAt.current.copy(_target);
    cam.lookAt(lookAt.current);

    if (t.current >= 1) onComplete?.();
  });

  return null;
}
