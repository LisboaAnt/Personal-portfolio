import type { CameraPose, CvSectionId } from "./types";
import { EXPERIENCE_DEFAULT_CAMERA } from "./experience-cameras";

/** Posição de referência (HUD / reset explorador). */
export const BLENDER_VIEW_POSITION: [number, number, number] = [108.054, 173.901, 13.582];

/** Ponto de olhar (alvo). */
export const BLENDER_ORBIT_TARGET: [number, number, number] = [40.661, 193.205, 52.126];

/** @deprecated Use {@link BLENDER_ORBIT_TARGET}. */
export const BLENDER_VIEW_TARGET: [number, number, number] = BLENDER_ORBIT_TARGET;

/** Rotação Euler em graus (referência debug). */
export const BLENDER_VIEW_ROTATION_DEG: [number, number, number] = [153.397, 57.395, -157.125];

export const BLENDER_VIEW_FOV = 42;

/** Órbita automática desligada — câmara fixa em {@link BLENDER_VIEW_POSITION}. */
export const BLENDER_ORBIT_ENABLED = false;

/** Distância da câmara ao {@link BLENDER_ORBIT_TARGET} (raio da órbita). */
export const BLENDER_ORBIT_RADIUS = 80;

/** Velocidade angular da órbita (radianos por segundo). */
export const BLENDER_ORBIT_SPEED = 0.12;

const _orbitDx = BLENDER_VIEW_POSITION[0] - BLENDER_ORBIT_TARGET[0];
const _orbitDy = BLENDER_VIEW_POSITION[1] - BLENDER_ORBIT_TARGET[1];
const _orbitDz = BLENDER_VIEW_POSITION[2] - BLENDER_ORBIT_TARGET[2];

/** Inclinação da órbita (rad acima do plano XZ), derivada da posição inicial. */
export const BLENDER_ORBIT_ELEVATION = Math.asin(
  _orbitDy / Math.hypot(_orbitDx, _orbitDy, _orbitDz),
);

/** Deslocamento vertical do ponto de olhar (unidades). 0 = alvo exato. */
export const BLENDER_ORBIT_LOOK_Y_OFFSET = 0;

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

/** Pose da secção Formação (scroll / desktop). */
export const EDUCATION_CAMERA: CameraPose = {
  position: [-225.013, 153.77, 123.81],
  target: [-303.966, 140.874, 123.632],
  fov: 42,
};

/** Formação — bacharelado (barra de diplomas / zoom). */
export const EDUCATION_BACHELOR_CAMERA: CameraPose = {
  position: [-248.249, 151.689, 123.975],
  target: [-328.232, 153.327, 123.535],
  fov: 42,
};

export const EDUCATION_BACHELOR_CARD_ID = "ufc-cs";

/** Formação — mentoria em empreendedorismo (barra de diplomas / zoom). */
export const EDUCATION_MENTOR_CAMERA: CameraPose = {
  position: [-247.701, 149.114, 115.866],
  target: [-325.429, 145.13, 97.363],
  fov: 42,
};

export const EDUCATION_MENTOR_CARD_ID = "ufc-mentor";

/** Formação — técnico em redes (SENAI) (barra de diplomas / zoom). */
export const EDUCATION_SENAI_CAMERA: CameraPose = {
  position: [-247.394, 150.338, 131.805],
  target: [-324.072, 149.547, 154.606],
  fov: 42,
};

export const EDUCATION_SENAI_CARD_ID = "senai";

/** Pose das secções Competências, Projetos e Contacto (scroll). */
export const SKILLS_CAMERA: CameraPose = {
  position: [-245.941, 148.893, 95.011],
  target: [-310.574, 147.781, 47.879],
  fov: 42,
};

const SKILLS_PROJECTS_CONTACT_SECTIONS = new Set<CvSectionId>(["skills", "projects", "contact"]);

function buildBlenderCameras(): Record<CvSectionId, CameraPose> {
  const cameras = {} as Record<CvSectionId, CameraPose>;

  CV_SCROLL_SECTION_ORDER.forEach((id, index) => {
    if (id === "experience") {
      cameras[id] = {
        position: [...EXPERIENCE_DEFAULT_CAMERA.position],
        target: [...EXPERIENCE_DEFAULT_CAMERA.target],
        fov: EXPERIENCE_DEFAULT_CAMERA.fov ?? BLENDER_VIEW_FOV,
      };
      return;
    }

    if (id === "education") {
      cameras[id] = {
        position: [...EDUCATION_CAMERA.position],
        target: [...EDUCATION_CAMERA.target],
        fov: EDUCATION_CAMERA.fov ?? BLENDER_VIEW_FOV,
      };
      return;
    }

    if (SKILLS_PROJECTS_CONTACT_SECTIONS.has(id)) {
      cameras[id] = {
        position: [...SKILLS_CAMERA.position],
        target: [...SKILLS_CAMERA.target],
        fov: SKILLS_CAMERA.fov ?? BLENDER_VIEW_FOV,
      };
      return;
    }

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
