import { create } from "zustand";
import { BLENDER_VIEW_TARGET } from "@/world/blender-camera";

type State = {
  target: [number, number, number];
  setTarget: (x: number, y: number, z: number) => void;
};

export const useWorldCameraLookStore = create<State>((set) => ({
  target: [...BLENDER_VIEW_TARGET],
  setTarget: (x, y, z) => set({ target: [x, y, z] }),
}));
