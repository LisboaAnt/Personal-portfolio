/** Secções do CV — cada uma é um alvo da câmara 3D */
export type CvSectionId =
  | "profile"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "contact";

/** @deprecated usar CvSectionId */
export type RoomId = CvSectionId;

export type TransitionStyle = "zoom" | "arc";

export type CameraPose = {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
};

export type SpikeIslandId = "home" | "work" | "lab";

export type SpikeIslandConfig = {
  id: SpikeIslandId;
  label: string;
  color: string;
  position: [number, number, number];
  camera: CameraPose;
};
