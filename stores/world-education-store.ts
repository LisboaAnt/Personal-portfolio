import { create } from "zustand";
import { EDUCATION_BACHELOR_CARD_ID } from "@/world/blender-camera";

type WorldEducationState = {
  /** Card / diploma activo na secção Formação (`null` = vista geral). */
  activeCardId: string | null;
  setActiveCard: (id: string | null) => void;
  /** Clique de novo no mesmo id → volta à câmara geral. */
  toggleActiveCard: (id: string) => void;
};

export const useWorldEducationStore = create<WorldEducationState>((set, get) => ({
  activeCardId: null,
  setActiveCard: (activeCardId) => {
    if (activeCardId === get().activeCardId) return;
    set({ activeCardId });
  },
  toggleActiveCard: (id) => {
    set({ activeCardId: get().activeCardId === id ? null : id });
  },
}));

export {
  EDUCATION_BACHELOR_CARD_ID,
  EDUCATION_MENTOR_CARD_ID,
  EDUCATION_SENAI_CARD_ID,
} from "@/world/blender-camera";
