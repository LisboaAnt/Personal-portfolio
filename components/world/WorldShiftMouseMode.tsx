"use client";

import { useEffect } from "react";
import { useWorldCameraInputStore } from "@/stores/world-camera-input-store";

const CLASS = "world-shift-camera";

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

export function WorldShiftMouseMode() {
  const freeCameraEnabled = useWorldCameraInputStore((s) => s.freeCameraEnabled);
  const setShiftMouse = useWorldCameraInputStore((s) => s.setShiftMouse);

  useEffect(() => {
    const activate = (active: boolean) => {
      if (!useWorldCameraInputStore.getState().freeCameraEnabled) {
        setShiftMouse(false);
        document.documentElement.classList.remove(CLASS);
        return;
      }
      setShiftMouse(active);
      document.documentElement.classList.toggle(CLASS, active);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!useWorldCameraInputStore.getState().freeCameraEnabled) return;
      if (isTypingTarget(e.target)) return;
      if (e.code !== "ShiftLeft" && e.code !== "ShiftRight") return;
      if (e.repeat) return;
      activate(true);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "ShiftLeft" && e.code !== "ShiftRight") return;
      activate(false);
    };

    const onBlur = () => activate(false);

    if (!freeCameraEnabled) {
      activate(false);
      return;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      activate(false);
    };
  }, [freeCameraEnabled, setShiftMouse]);

  return null;
}
