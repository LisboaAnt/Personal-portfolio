import { create } from "zustand";
import type { ExperienceJobId } from "@/world/experience-cameras";

type WorldExperienceState = {
  activeJobId: ExperienceJobId;
  activeStageIndex: number;
  setActiveJob: (id: ExperienceJobId) => void;
  setActiveStage: (index: number) => void;
};

export const useWorldExperienceStore = create<WorldExperienceState>((set, get) => ({
  activeJobId: "vittahub",
  activeStageIndex: 0,
  setActiveJob: (activeJobId) => {
    if (activeJobId === get().activeJobId) return;
    set({ activeJobId, activeStageIndex: 0 });
  },
  setActiveStage: (activeStageIndex) => {
    if (activeStageIndex === get().activeStageIndex) return;
    set({ activeStageIndex: Math.max(0, activeStageIndex) });
  },
}));
