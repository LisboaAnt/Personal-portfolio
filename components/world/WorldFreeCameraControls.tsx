"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { useWorldCameraInputStore } from "@/stores/world-camera-input-store";
import { useWorldCameraLookStore } from "@/stores/world-camera-look-store";
import { WORLD_WASD_MOVE_SPEED } from "@/world/constants";

const LOOK_AHEAD = 80;
const ROTATE_SENS = 0.0011;
const PAN_SENS = 0.07;
const WHEEL_SENS = 0.11;
const FAST_MULTIPLIER = 3;

const _dir = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _pan = new THREE.Vector3();
const _move = new THREE.Vector3();
const _euler = new THREE.Euler(0, 0, 0, "YXZ");

type KeyMap = { w: boolean; a: boolean; s: boolean; d: boolean; q: boolean; e: boolean };

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

const ORBIT_RESUME_MS = 1500;

export function WorldFreeCameraControls() {
  const { camera, invalidate } = useThree();
  const paused = useWorldPaused();
  const shiftMouse = useWorldCameraInputStore((s) => s.shiftMouse);
  const freeCameraEnabled = useWorldCameraInputStore((s) => s.freeCameraEnabled);
  const setOrbitPaused = useWorldCameraInputStore((s) => s.setOrbitPaused);
  const setLookTarget = useWorldCameraLookStore((s) => s.setTarget);
  const drag = useRef<"left" | "right" | null>(null);
  const keys = useRef<KeyMap>({ w: false, a: false, s: false, d: false, q: false, e: false });
  const fast = useRef(false);
  const orbitResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseOrbit = () => {
    setOrbitPaused(true);
    if (orbitResumeTimer.current) clearTimeout(orbitResumeTimer.current);
    orbitResumeTimer.current = setTimeout(() => {
      const k = keys.current;
      const moving = k.w || k.a || k.s || k.d || k.q || k.e;
      if (!moving && !useWorldCameraInputStore.getState().shiftMouse) {
        setOrbitPaused(false);
      }
    }, ORBIT_RESUME_MS);
  };

  const syncLookTarget = () => {
    camera.getWorldDirection(_dir);
    const tx = camera.position.x + _dir.x * LOOK_AHEAD;
    const ty = camera.position.y + _dir.y * LOOK_AHEAD;
    const tz = camera.position.z + _dir.z * LOOK_AHEAD;
    setLookTarget(tx, ty, tz);
  };

  const moveAlongView = (amount: number) => {
    pauseOrbit();
    camera.getWorldDirection(_dir);
    camera.position.addScaledVector(_dir, amount);
    syncLookTarget();
    invalidate();
  };

  const applyPan = (dx: number, dy: number) => {
    const moveSpeed = useWorldCameraInputStore.getState().moveSpeed;
    pauseOrbit();
    camera.getWorldDirection(_dir);
    _right.crossVectors(_dir, _up).normalize();
    _pan.set(0, 0, 0);
    _pan.addScaledVector(_right, -dx * PAN_SENS * moveSpeed);
    _pan.addScaledVector(_up, dy * PAN_SENS * moveSpeed);
    camera.position.add(_pan);
    syncLookTarget();
    invalidate();
  };

  useEffect(() => {
    useWorldCameraInputStore.getState().hydrateMoveSpeed();
    if (paused || !freeCameraEnabled) return;

    const setKey = (code: string, down: boolean) => {
      switch (code) {
        case "KeyW":
          keys.current.w = down;
          break;
        case "KeyA":
          keys.current.a = down;
          break;
        case "KeyS":
          keys.current.s = down;
          break;
        case "KeyD":
          keys.current.d = down;
          break;
        case "KeyQ":
          keys.current.q = down;
          break;
        case "KeyE":
          keys.current.e = down;
          break;
        default:
          return;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        fast.current = true;
        return;
      }
      if (e.code === "AltLeft" || e.code === "AltRight") {
        fast.current = true;
        return;
      }
      if (
        e.code === "KeyW" ||
        e.code === "KeyA" ||
        e.code === "KeyS" ||
        e.code === "KeyD" ||
        e.code === "KeyQ" ||
        e.code === "KeyE"
      ) {
        e.preventDefault();
        setKey(e.code, true);
        invalidate();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        if (!keys.current.w && !keys.current.a && !keys.current.s && !keys.current.d) {
          fast.current = false;
        }
        return;
      }
      if (e.code === "AltLeft" || e.code === "AltRight") {
        fast.current = false;
        return;
      }
      setKey(e.code, false);
      invalidate();
    };

    const onWheel = (e: WheelEvent) => {
      if (isTypingTarget(e.target)) return;
      if (!shiftMouse && e.target instanceof Element && e.target.closest(".world-overlay")) {
        return;
      }
      e.preventDefault();
      const mult = fast.current || shiftMouse ? FAST_MULTIPLIER : 1;
      const moveSpeed = useWorldCameraInputStore.getState().moveSpeed;
      moveAlongView(-e.deltaY * WHEEL_SENS * mult * moveSpeed);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!shiftMouse) return;
      if (e.button === 0) drag.current = "left";
      if (e.button === 2) drag.current = "right";
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 0 && drag.current === "left") drag.current = null;
      if (e.button === 2 && drag.current === "right") drag.current = null;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.current) return;

      if (drag.current === "left") {
        const moveSpeed = useWorldCameraInputStore.getState().moveSpeed;
        pauseOrbit();
        _euler.setFromQuaternion(camera.quaternion, "YXZ");
        _euler.y -= e.movementX * ROTATE_SENS * moveSpeed;
        _euler.x -= e.movementY * ROTATE_SENS * moveSpeed;
        const limit = Math.PI / 2 - 0.02;
        _euler.x = THREE.MathUtils.clamp(_euler.x, -limit, limit);
        camera.quaternion.setFromEuler(_euler);
        syncLookTarget();
        invalidate();
        return;
      }

      applyPan(e.movementX, e.movementY);
    };

    const onContextMenu = (e: MouseEvent) => {
      if (shiftMouse) e.preventDefault();
    };

    const onBlur = () => {
      keys.current = { w: false, a: false, s: false, d: false, q: false, e: false };
      fast.current = false;
      drag.current = null;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("blur", onBlur);

    return () => {
      if (orbitResumeTimer.current) clearTimeout(orbitResumeTimer.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("blur", onBlur);
    };
  }, [camera, freeCameraEnabled, invalidate, paused, setLookTarget, shiftMouse]);

  const moveSpeed = useWorldCameraInputStore((s) => s.moveSpeed);

  useFrame((_, delta) => {
    if (paused || !freeCameraEnabled) return;

    const k = keys.current;
    if (!k.w && !k.a && !k.s && !k.d && !k.q && !k.e) return;

    const speed =
      WORLD_WASD_MOVE_SPEED *
      moveSpeed *
      delta *
      (fast.current || shiftMouse ? FAST_MULTIPLIER : 1);

    camera.getWorldDirection(_dir);
    _right.crossVectors(_dir, _up).normalize();
    _move.set(0, 0, 0);

    if (k.w) _move.add(_dir);
    if (k.s) _move.sub(_dir);
    if (k.d) _move.add(_right);
    if (k.a) _move.sub(_right);
    if (k.e) _move.add(_up);
    if (k.q) _move.sub(_up);

    if (_move.lengthSq() === 0) return;
    pauseOrbit();
    _move.normalize().multiplyScalar(speed);
    camera.position.add(_move);
    syncLookTarget();
    invalidate();
  });

  return null;
}
