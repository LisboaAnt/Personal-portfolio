import { create } from "zustand";
import type { CvSectionId } from "@/world/types";

export type WorldPhase = "idle" | "traveling";
export type WorldCameraMode = "scroll" | "nav";

type WorldState = {
  /** Sala em foco (câmara + ilha ativa) */
  focusRoomId: CvSectionId;
  phase: WorldPhase;
  cameraMode: WorldCameraMode;
  /** Pausa render/animações (ex.: Snake aberto) */
  paused: boolean;
  setFocusRoom: (id: CvSectionId) => void;
  setPhase: (phase: WorldPhase) => void;
  /** Navegação programática (navbar, hints) — bloqueia sync do scroll até terminar. */
  beginScrollNav: (id: CvSectionId) => void;
  beginTravel: (id: CvSectionId) => void;
  setPaused: (paused: boolean) => void;
};

export const useWorldStore = create<WorldState>((set, get) => ({
  focusRoomId: "profile",
  phase: "idle",
  cameraMode: "scroll",
  paused: false,
  setFocusRoom: (id) => {
    if (get().focusRoomId === id) return;
    set({ focusRoomId: id, cameraMode: "scroll" });
  },
  setPhase: (phase) => set({ phase }),
  beginScrollNav: (id) => {
    set({ focusRoomId: id, phase: "traveling", cameraMode: "scroll" });
  },
  beginTravel: (id) => {
    set({ focusRoomId: id, phase: "traveling", cameraMode: "nav" });
  },
  setPaused: (paused) => set({ paused }),
}));

/** @deprecated use focusRoomId */
export const selectFocusRoomId = (s: WorldState) => s.focusRoomId;
