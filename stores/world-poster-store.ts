import { create } from "zustand";

type WorldPosterState = {
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
  reset: () => void;
};

export const useWorldPosterStore = create<WorldPosterState>((set) => ({
  sceneReady: false,
  setSceneReady: (sceneReady) => set({ sceneReady }),
  reset: () => set({ sceneReady: false }),
}));
