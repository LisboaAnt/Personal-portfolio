import { create } from "zustand";

export type WorldCameraDebugState = {
  position: [number, number, number];
  target: [number, number, number];
  rotationDeg: [number, number, number];
  fov: number;
  setSnapshot: (data: Omit<WorldCameraDebugState, "setSnapshot">) => void;
};

const round3 = (n: number) => Math.round(n * 1000) / 1000;

export const useWorldCameraDebugStore = create<WorldCameraDebugState>((set) => ({
  position: [0, 0, 0],
  target: [0, 0, 0],
  rotationDeg: [0, 0, 0],
  fov: 42,
  setSnapshot: ({ position, target, rotationDeg, fov }) =>
    set({
      position: [round3(position[0]), round3(position[1]), round3(position[2])],
      target: [round3(target[0]), round3(target[1]), round3(target[2])],
      rotationDeg: [
        round3(rotationDeg[0]),
        round3(rotationDeg[1]),
        round3(rotationDeg[2]),
      ],
      fov: round3(fov),
    }),
}));
