import { create } from "zustand";
import {
  WORLD_CAMERA_MOVE_SPEED_DEFAULT,
  WORLD_CAMERA_MOVE_SPEED_MAX,
  WORLD_CAMERA_MOVE_SPEED_MIN,
  WORLD_CAMERA_MOVE_SPEED_STORAGE_KEY,
  WORLD_FREE_CAMERA_STORAGE_KEY,
} from "@/world/constants";

export function clampCameraMoveSpeed(value: number): number {
  return Math.min(
    WORLD_CAMERA_MOVE_SPEED_MAX,
    Math.max(WORLD_CAMERA_MOVE_SPEED_MIN, value),
  );
}

export function readCameraMoveSpeed(): number {
  if (typeof window === "undefined") return WORLD_CAMERA_MOVE_SPEED_DEFAULT;
  try {
    const raw = localStorage.getItem(WORLD_CAMERA_MOVE_SPEED_STORAGE_KEY);
    if (raw == null) return WORLD_CAMERA_MOVE_SPEED_DEFAULT;
    const n = Number(raw);
    if (!Number.isFinite(n)) return WORLD_CAMERA_MOVE_SPEED_DEFAULT;
    return clampCameraMoveSpeed(n);
  } catch {
    return WORLD_CAMERA_MOVE_SPEED_DEFAULT;
  }
}

function persistCameraMoveSpeed(speed: number) {
  try {
    localStorage.setItem(WORLD_CAMERA_MOVE_SPEED_STORAGE_KEY, String(speed));
  } catch {
    /* ignore */
  }
}

function readFreeCameraEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(WORLD_FREE_CAMERA_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function persistFreeCameraEnabled(enabled: boolean) {
  try {
    localStorage.setItem(WORLD_FREE_CAMERA_STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    /* ignore */
  }
}

type WorldCameraInputState = {
  /** Shift premido — rato controla a câmara (só com freeCameraEnabled). */
  shiftMouse: boolean;
  setShiftMouse: (active: boolean) => void;
  /** Pausa poses scriptadas enquanto o utilizador move a câmara livre. */
  orbitPaused: boolean;
  setOrbitPaused: (paused: boolean) => void;
  /** Exploração livre activada no HUD Debug 3D. */
  freeCameraEnabled: boolean;
  setFreeCameraEnabled: (enabled: boolean) => void;
  /** Incrementado ao desligar câmara livre — força re-sync da pose scriptada. */
  cameraPoseVersion: number;
  /** Multiplicador da velocidade de movimento livre (WASD, rato, roda). */
  moveSpeed: number;
  setMoveSpeed: (speed: number) => void;
  adjustMoveSpeed: (delta: number) => void;
  hydrateMoveSpeed: () => void;
  hydrateFreeCamera: () => void;
};

export const useWorldCameraInputStore = create<WorldCameraInputState>((set, get) => ({
  shiftMouse: false,
  setShiftMouse: (shiftMouse) => set({ shiftMouse }),
  orbitPaused: false,
  setOrbitPaused: (orbitPaused) => set({ orbitPaused }),
  freeCameraEnabled: false,
  cameraPoseVersion: 0,
  setFreeCameraEnabled: (freeCameraEnabled) => {
    persistFreeCameraEnabled(freeCameraEnabled);
    if (!freeCameraEnabled) {
      set({
        freeCameraEnabled: false,
        shiftMouse: false,
        orbitPaused: false,
        cameraPoseVersion: get().cameraPoseVersion + 1,
      });
      document.documentElement.classList.remove("world-shift-camera");
      return;
    }
    set({ freeCameraEnabled: true });
  },
  moveSpeed: WORLD_CAMERA_MOVE_SPEED_DEFAULT,
  setMoveSpeed: (moveSpeed) => {
    const clamped = clampCameraMoveSpeed(moveSpeed);
    persistCameraMoveSpeed(clamped);
    set({ moveSpeed: clamped });
  },
  adjustMoveSpeed: (delta) => {
    const next = clampCameraMoveSpeed(get().moveSpeed + delta);
    persistCameraMoveSpeed(next);
    set({ moveSpeed: next });
  },
  hydrateMoveSpeed: () => set({ moveSpeed: readCameraMoveSpeed() }),
  hydrateFreeCamera: () => set({ freeCameraEnabled: readFreeCameraEnabled() }),
}));
