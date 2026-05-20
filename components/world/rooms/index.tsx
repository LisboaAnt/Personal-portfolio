import type { ReactElement } from "react";
import type { CvSectionId } from "@/world/types";
import { RoomContact } from "./RoomContact";
import { RoomFlow } from "./RoomFlow";
import { RoomHome } from "./RoomHome";
import { RoomLab } from "./RoomLab";
import { RoomProjects } from "./RoomProjects";
import { RoomWork } from "./RoomWork";

export { RoomShell } from "./RoomShell";

type RoomProps = { active: boolean; accent: string };

export const ROOM_DIORAMAS: Record<CvSectionId, (props: RoomProps) => ReactElement> = {
  profile: RoomHome,
  experience: (p) => <RoomWork active={p.active} />,
  projects: (p) => <RoomProjects active={p.active} />,
  education: RoomFlow,
  skills: RoomLab,
  contact: RoomContact,
};
