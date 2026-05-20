import { BLENDER_CV_CAMERAS } from "./blender-camera";
import { isBlenderWorldScene } from "./world-scene-mode";
import type { CameraPose, CvSectionId } from "./types";

export type CvSectionConfig = {
  id: CvSectionId;
  color: string;
  position: [number, number, number];
  camera: CameraPose;
};

export const CV_SECTIONS: CvSectionConfig[] = [
  {
    id: "profile",
    color: "#6366f1",
    position: [-12, -550, 230],
    camera: { position: [-12.106, -551.26, 237.03], target: [-12, -400, 50], fov: 42 },
  },
  {
    id: "experience",
    color: "#818cf8",
    position: [-5.4, 0.65, 0],
    camera: { position: [-5.4, 2.85, 6.4], target: [-5.4, 0.5, 0], fov: 40 },
  },
  {
    id: "projects",
    color: "#8b5cf6",
    position: [-1.8, 0.65, 0],
    camera: { position: [-1.8, 2.7, 6.5], target: [-1.8, 0.5, 0], fov: 40 },
  },
  {
    id: "education",
    color: "#22d3ee",
    position: [1.8, 0.65, 0],
    camera: { position: [1.8, 2.7, 6.5], target: [1.8, 0.5, 0], fov: 40 },
  },
  {
    id: "skills",
    color: "#a78bfa",
    position: [5.4, 0.65, 0],
    camera: { position: [5.4, 2.6, 7], target: [5.4, 0.5, 0], fov: 42 },
  },
  {
    id: "contact",
    color: "#10b981",
    position: [9, 0.65, 0],
    camera: { position: [9, 2.6, 7], target: [9, 0.5, 0], fov: 42 },
  },
];

export const CV_OVERVIEW_CAMERA: CameraPose = {
  position: [0, 6.5, 16],
  target: [0, 0, 0],
  fov: 48,
};

export function getCvSectionById(id: CvSectionId): CvSectionConfig {
  const section = CV_SECTIONS.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown CV section: ${id}`);
  return section;
}

export function getCvSectionCamera(id: CvSectionId): CameraPose {
  if (isBlenderWorldScene()) return BLENDER_CV_CAMERAS[id];
  return getCvSectionById(id).camera;
}

/** Compat: salas antigas */
export const WORLD_ROOMS = CV_SECTIONS.map((s) => ({
  ...s,
  label: s.id,
  paths: ["/"],
}));

export function getRoomById(id: CvSectionId) {
  return getCvSectionById(id);
}

export function getRoomCamera(id: CvSectionId) {
  return getCvSectionCamera(id);
}
