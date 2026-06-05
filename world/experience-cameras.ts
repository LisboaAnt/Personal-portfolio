import type { CameraPose } from "./types";

export type ExperienceJobId = "vittahub" | "alemsys" | "ufc" | "ussin";

const TARGET: [number, number, number] = [40.661, 193.205, 52.126];

/** Percurso lento na etapa 0 (descrição do projeto) — Vittahub. */
export const VITTAHUB_PROJECT_DESCRIPTION_ORBIT: readonly CameraPose[] = [
  {
    position: [106.909, 153.073, 179.165],
    target: [30.606, 140.876, 158.448],
    fov: 42,
  },
  {
    position: [84.293, 154.133, 204.538],
    target: [59.408, 140.502, 129.739],
    fov: 42,
  },
  {
    position: [54.871, 153.594, 193.696],
    target: [101.628, 140.093, 130.201],
    fov: 42,
  },
] as const;

/** Primeiro waypoint do percurso: 2 → 3 → 1 → 2… */
export const VITTAHUB_PROJECT_ORBIT_START_INDEX = 1;

/** Percurso lento na etapa 0 (descrição do projeto) — Alémsys Digital. */
export const ALEMSYS_PROJECT_DESCRIPTION_ORBIT: readonly CameraPose[] = [
  {
    position: [41.575, 147.572, 85.171],
    target: [49.739, 144.38, 5.652],
    fov: 42,
  },
  {
    position: [36.545, 148.208, 78.188],
    target: [74.543, 149.415, 7.799],
    fov: 42,
  },
  {
    position: [52.391, 144.879, 79.996],
    target: [6.758, 155.035, 15.077],
    fov: 42,
  },
] as const;

/** Percurso lento na etapa 0 (descrição do projeto) — UFC. */
export const UFC_PROJECT_DESCRIPTION_ORBIT: readonly CameraPose[] = [
  {
    position: [70.19, 143.945, 271.517],
    target: [144.595, 135.458, 299.655],
    fov: 42,
  },
  {
    position: [76.94, 143.511, 268.098],
    target: [123.285, 134.141, 332.629],
    fov: 42,
  },
  {
    position: [73.45, 143.64, 274.962],
    target: [152.677, 134.06, 269.361],
    fov: 42,
  },
] as const;

/** Percurso lento na etapa 0 (descrição do projeto) — Ussin. */
export const USSIN_PROJECT_DESCRIPTION_ORBIT: readonly CameraPose[] = [
  {
    position: [-17.848, 154.581, 233.992],
    target: [-42.66, 147.028, 309.671],
    fov: 42,
  },
  {
    position: [-9.888, 154.581, 251.301],
    target: [-87.718, 145.54, 267.449],
    fov: 42,
  },
] as const;

/** Pose ao entrar na secção Experience (referência do HUD). */
export const EXPERIENCE_DEFAULT_CAMERA: CameraPose = {
  position: [99.283, 147.068, 207.504],
  target: TARGET,
  fov: 42,
};

/** Poses por etapa (índice 0 = visão geral, 1+ = momentos no cenário). */
export const EXPERIENCE_JOB_STAGE_CAMERAS: Record<ExperienceJobId, CameraPose[]> = {
  vittahub: [
    { ...VITTAHUB_PROJECT_DESCRIPTION_ORBIT[VITTAHUB_PROJECT_ORBIT_START_INDEX]! },
    {
      position: [80.942, 145.644, 217.55],
      target: [73.591, 143.558, 137.915],
      fov: 42,
    },
    {
      position: [75.505, 146.315, 187.617],
      target: [69.732, 130.819, 109.345],
      fov: 42,
    },
    {
      position: [98.535, 145.422, 209.234],
      target: [90.905, 141.103, 129.716],
      fov: 40,
    },
  ],
  alemsys: [
    { ...ALEMSYS_PROJECT_DESCRIPTION_ORBIT[0]! },
    {
      position: [48.374, 149.838, 74.778],
      target: [46.362, 150.602, -5.193],
      fov: 41,
    },
    {
      position: [44.902, 142.249, 80.141],
      target: [42.558, 138.949, 0.243],
      fov: 41,
    },
    {
      position: [43.18, 146.969, 74.619],
      target: [43.17, 146.241, -5.377],
      fov: 41,
    },
    {
      position: [38.033, 143.289, 77.873],
      target: [38.019, 139.906, -2.056],
      fov: 41,
    },
    {
      position: [40.182, 150.102, 74.398],
      target: [40.471, 147.65, -5.564],
      fov: 41,
    },
    {
      position: [35.763, 146.407, 76.603],
      target: [47.228, 142.091, -2.454],
      fov: 41,
    },
  ],
  ufc: [
    { ...UFC_PROJECT_DESCRIPTION_ORBIT[0]! },
    {
      position: [76.645, 144.306, 272.882],
      target: [152.631, 119.608, 276.889],
      fov: 42,
    },
    {
      position: [72.562, 146.057, 268.625],
      target: [133.137, 117.825, 312.599],
      fov: 42,
    },
  ],
  ussin: [
    { ...USSIN_PROJECT_DESCRIPTION_ORBIT[0]! },
    {
      position: [-19.993, 155.242, 249.319],
      target: [-90.818, 143.233, 284.526],
      fov: 41,
    },
    {
      position: [-20.55, 154.683, 249.795],
      target: [-89.858, 127.545, 279.121],
      fov: 41,
    },
    {
      position: [-19.068, 152.034, 249.258],
      target: [-92.366, 147.832, 281.035],
      fov: 41,
    },
  ],
};

/** Pose base por job (etapa 0). */
export const EXPERIENCE_JOB_CAMERAS: Record<ExperienceJobId, CameraPose> = {
  vittahub: EXPERIENCE_JOB_STAGE_CAMERAS.vittahub[0]!,
  alemsys: EXPERIENCE_JOB_STAGE_CAMERAS.alemsys[0]!,
  ufc: EXPERIENCE_JOB_STAGE_CAMERAS.ufc[0]!,
  ussin: EXPERIENCE_JOB_STAGE_CAMERAS.ussin[0]!,
};

export function isExperienceJobId(id: string): id is ExperienceJobId {
  return id in EXPERIENCE_JOB_STAGE_CAMERAS;
}

export function getExperienceStageCount(jobId: ExperienceJobId): number {
  return EXPERIENCE_JOB_STAGE_CAMERAS[jobId].length;
}

export function getExperienceCameraPose(
  jobId: ExperienceJobId,
  stageIndex: number,
): CameraPose {
  const poses = EXPERIENCE_JOB_STAGE_CAMERAS[jobId];
  const index = Math.max(0, Math.min(stageIndex, poses.length - 1));
  return poses[index]!;
}

/** Percurso cíclico lento para uma etapa (null = pose estática). */
export function resolveExperienceStageOrbit(
  jobId: ExperienceJobId,
  stageIndex: number,
): readonly CameraPose[] | null {
  if (jobId === "vittahub" && stageIndex === 0) {
    return VITTAHUB_PROJECT_DESCRIPTION_ORBIT;
  }
  if (jobId === "alemsys" && stageIndex === 0) {
    return ALEMSYS_PROJECT_DESCRIPTION_ORBIT;
  }
  if (jobId === "ufc" && stageIndex === 0) {
    return UFC_PROJECT_DESCRIPTION_ORBIT;
  }
  if (jobId === "ussin" && stageIndex === 0) {
    return USSIN_PROJECT_DESCRIPTION_ORBIT;
  }
  return null;
}

export function resolveExperienceStageOrbitStart(
  jobId: ExperienceJobId,
  stageIndex: number,
): number {
  if (jobId === "vittahub" && stageIndex === 0) {
    return VITTAHUB_PROJECT_ORBIT_START_INDEX;
  }
  return 0;
}
