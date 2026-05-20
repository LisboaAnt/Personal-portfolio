import type { CameraPose, CvSectionId } from "./types";

/** Posição inicial da câmara (HUD / explorador 3D). */
export const BLENDER_VIEW_POSITION: [number, number, number] = [-7.036, 322.074, -43.784];

/** Ponto para onde a câmara olha (alvo). */
export const BLENDER_VIEW_TARGET: [number, number, number] = [-10.078, 321.038, 36.151];

/** Rotação Euler em graus (referência debug). */
export const BLENDER_VIEW_ROTATION_DEG: [number, number, number] = [-179.257, 2.18, 179.972];

export const BLENDER_VIEW_FOV = 42;

/** Deslocamento horizontal do alvo entre secções (scroll). */
const TARGET_PAN_X = 6;

/** Ordem das secções na home (scroll vertical). */
export const CV_SCROLL_SECTION_ORDER: CvSectionId[] = [
  "profile",
  "experience",
  "education",
  "skills",
  "projects",
  "contact",
];

function buildBlenderCameras(): Record<CvSectionId, CameraPose> {
  const cameras = {} as Record<CvSectionId, CameraPose>;

  CV_SCROLL_SECTION_ORDER.forEach((id, index) => {
    cameras[id] = {
      position: [...BLENDER_VIEW_POSITION],
      target: [
        BLENDER_VIEW_TARGET[0] + index * TARGET_PAN_X,
        BLENDER_VIEW_TARGET[1],
        BLENDER_VIEW_TARGET[2],
      ],
      fov: BLENDER_VIEW_FOV,
    };
  });

  return cameras;
}

/** Uma pose por secção (scroll / fallback). */
export const BLENDER_CV_CAMERAS = buildBlenderCameras();
