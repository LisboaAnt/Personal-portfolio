import { create } from "zustand";
import { EDUCATION_BACHELOR_CARD_ID } from "@/world/blender-camera";

type WorldEducationState = {
  /** Card expandido na secção Formação (`null` = nenhum). */
  activeCardId: string | null;
  setActiveCard: (id: string | null) => void;
};

export const useWorldEducationStore = create<WorldEducationState>((set, get) => ({
  activeCardId: null,
  setActiveCard: (activeCardId) => {
    if (activeCardId === get().activeCardId) return;
    set({ activeCardId });
  },
}));

export {
  EDUCATION_BACHELOR_CARD_ID,
  EDUCATION_MENTOR_CARD_ID,
  EDUCATION_SENAI_CARD_ID,
} from "@/world/blender-camera";
