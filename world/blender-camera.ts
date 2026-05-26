import type { CameraPose, CvSectionId } from "./types";

/** Posição de referência (HUD / reset explorador). */
export const BLENDER_VIEW_POSITION: [number, number, number] = [-178.832, -64.733, -80.385];

/** Ponto central — a câmara orbita e olha sempre para aqui. */
export const BLENDER_ORBIT_TARGET: [number, number, number] = [-190, -78, -79.817];

/** @deprecated Use {@link BLENDER_ORBIT_TARGET}. */
export const BLENDER_VIEW_TARGET: [number, number, number] = BLENDER_ORBIT_TARGET;

/** Rotação Euler em graus (referência debug). */
export const BLENDER_VIEW_ROTATION_DEG: [number, number, number] = [-92.325, -79.922, -92.362];

export const BLENDER_VIEW_FOV = 42;

/** Distância da câmara ao {@link BLENDER_ORBIT_TARGET} (raio da órbita). */
export const BLENDER_ORBIT_RADIUS = 35;

/** Velocidade angular da órbita (radianos por segundo). */
export const BLENDER_ORBIT_SPEED = 0.12;

const _orbitDx = BLENDER_VIEW_POSITION[0] - BLENDER_ORBIT_TARGET[0];
const _orbitDy = BLENDER_VIEW_POSITION[1] - BLENDER_ORBIT_TARGET[1];
const _orbitDz = BLENDER_VIEW_POSITION[2] - BLENDER_ORBIT_TARGET[2];
const _orbitReferenceDist = Math.hypot(_orbitDx, _orbitDy, _orbitDz);

/** Inclinação da órbita (rad acima do plano XZ), derivada da posição inicial. */
export const BLENDER_ORBIT_ELEVATION = 0.45;

/** Deslocamento vertical do ponto de olhar (unidades). Positivo = câmara olha mais para cima. */
export const BLENDER_ORBIT_LOOK_Y_OFFSET = 15;

/** Ângulo inicial no plano horizontal (rad). */
export const BLENDER_ORBIT_INITIAL_ANGLE = Math.atan2(_orbitDx, _orbitDz);

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
