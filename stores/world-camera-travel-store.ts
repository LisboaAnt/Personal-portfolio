import { create } from "zustand";
import type { CvSectionId } from "@/world/types";

type WorldCameraTravelState = {
  blurPx: number;
  isTraveling: boolean;
  /** 0–1 — progresso da viagem (câmara + iluminação). */
  progress: number;
  lightingFrom: CvSectionId | null;
  lightingTo: CvSectionId | null;
  setTravel: (payload: {
    blurPx: number;
    isTraveling: boolean;
    progress?: number;
    lightingFrom?: CvSectionId | null;
    lightingTo?: CvSectionId | null;
  }) => void;
};

export const useWorldCameraTravelStore = create<WorldCameraTravelState>((set) => ({
  blurPx: 0,
  isTraveling: false,
  progress: 0,
  lightingFrom: null,
  lightingTo: null,
  setTravel: (payload) =>
    set((state) => ({
      blurPx: payload.blurPx,
      isTraveling: payload.isTraveling,
      progress: payload.progress ?? (payload.isTraveling ? state.progress : 0),
      lightingFrom:
        payload.lightingFrom !== undefined ? payload.lightingFrom : state.lightingFrom,
      lightingTo: payload.lightingTo !== undefined ? payload.lightingTo : state.lightingTo,
    })),
}));
