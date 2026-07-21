import { create } from "zustand";
import { WORLD_EDUCATION_QUALITY_BOOST_MAX } from "@/world/constants";

type WorldEducationQualityState = {
  /** 0 = qualidade base; sobe só em Education com FPS alto (desktop). */
  boost: number;
  setBoost: (boost: number) => void;
  reset: () => void;
};

export const useWorldEducationQualityStore = create<WorldEducationQualityState>((set) => ({
  boost: 0,
  setBoost: (boost) =>
    set({
      boost: Math.max(0, Math.min(WORLD_EDUCATION_QUALITY_BOOST_MAX, Math.round(boost))),
    }),
  reset: () => set({ boost: 0 }),
}));
