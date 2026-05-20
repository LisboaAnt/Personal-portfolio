import { create } from "zustand";

type WorldCameraInputState = {
  /** Shift premido — rato controla a câmara em todo o ecrã */
  shiftMouse: boolean;
  setShiftMouse: (active: boolean) => void;
};

export const useWorldCameraInputStore = create<WorldCameraInputState>((set) => ({
  shiftMouse: false,
  setShiftMouse: (shiftMouse) => set({ shiftMouse }),
}));
