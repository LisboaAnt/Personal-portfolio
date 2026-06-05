import type { CameraPose } from "./types";

export type ExperienceJobId = "vittahub" | "alemsys" | "ufc" | "ussin";

const TARGET: [number, number, number] = [40.661, 193.205, 52.126];

/** Pose ao entrar na secção Experience (referência do HUD). */
export const EXPERIENCE_DEFAULT_CAMERA: CameraPose = {
  position: [99.283, 147.068, 207.504],
  target: TARGET,
  fov: 42,
};

/** Poses por etapa (índice 0 = visão geral, 1+ = momentos no cenário). */
export const EXPERIENCE_JOB_STAGE_CAMERAS: Record<ExperienceJobId, CameraPose[]> = {
  vittahub: [
    EXPERIENCE_DEFAULT_CAMERA,
    {
      position: [81.054, 145.187, 217.976],
      target: [60.834, 140.173, 41.881],
      fov: 42,
    },
    {
      position: [118.2, 141.5, 186.3],
      target: [45.2, 191.4, 58.8],
      fov: 40,
    },
  ],
  alemsys: [
    {
      position: [91.8, 154.2, 214.7],
      target: [38.4, 190.8, 54.2],
      fov: 42,
    },
    {
      position: [78.2, 158.6, 226.4],
      target: [36.8, 189.2, 51.6],
      fov: 41,
    },
    {
      position: [104.5, 146.8, 198.2],
      target: [42.6, 192.4, 56.8],
      fov: 40,
    },
  ],
  ufc: [
    {
      position: [106.5, 132.4, 182.9],
      target: [48.3, 195.6, 59.4],
      fov: 42,
    },
    {
      position: [98.4, 138.6, 191.2],
      target: [46.8, 194.2, 58.1],
      fov: 41,
    },
    {
      position: [112.8, 128.4, 176.5],
      target: [50.2, 196.8, 60.6],
      fov: 40,
    },
    {
      position: [101.2, 125.8, 168.4],
      target: [47.6, 193.4, 57.2],
      fov: 39,
    },
  ],
  ussin: [
    {
      position: [84.6, 161.3, 223.8],
      target: [34.8, 188.2, 47.5],
      fov: 42,
    },
    {
      position: [76.8, 165.4, 232.6],
      target: [33.2, 187.4, 46.2],
      fov: 41,
    },
    {
      position: [92.4, 155.8, 210.4],
      target: [36.4, 189.6, 48.8],
      fov: 40,
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
