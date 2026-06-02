import * as THREE from "three";
import { getBlenderLightingFromEnv } from "./blender-lighting-env";
import { getCvSectionById } from "./cv-sections";
import type { CvSectionId } from "./types";

/**
 * Multiplicadores por secção (relativos ao `.env`).
 * Ordem no scroll da página ≈ índice + 1: profile=1, experience=2, projects=3, …
 */
export type CvSectionLightingModifiers = {
  envMul: number;
  ambientMul: number;
  directionalMul: number;
  toneExposureMul?: number;
  /** Cor de tint na luz ambiente (hex). Omitir = branco. */
  ambientTint?: string;
  /** Cor da luz direcional (hex). Omitir = branco. */
  directionalTint?: string;
};

export const CV_SECTION_LIGHTING_MODIFIERS: Record<CvSectionId, CvSectionLightingModifiers> = {
  profile: {
    envMul: 0.9,
    ambientMul: 0.85,
    directionalMul: 0.9,
    toneExposureMul: 0.85,
  },
  /** Experiência: mais clara que o profile, sem exagerar (meio-termo). */
  experience: {
    envMul: 8,
    ambientMul: 6.5,
    directionalMul: 4.9,
    toneExposureMul: 6.6,
    ambientTint: "#fffbeb",
    directionalTint: "#fde68a",
  },
  education: {
    envMul: 4.2,
    ambientMul: 3.4,
    directionalMul: 2.8,
    toneExposureMul: 3.8,
    ambientTint: "#ecfeff",
    directionalTint: "#67e8f9",
  },
  skills: {
    envMul: 4,
    ambientMul: 3.3,
    directionalMul: 2.7,
    toneExposureMul: 3.6,
    ambientTint: "#f5f3ff",
    directionalTint: "#ddd6fe",
  },
  projects: {
    envMul: 4.1,
    ambientMul: 3.35,
    directionalMul: 2.75,
    toneExposureMul: 3.7,
    ambientTint: "#faf5ff",
    directionalTint: "#e9d5ff",
  },
  contact: {
    envMul: 4.3,
    ambientMul: 3.5,
    directionalMul: 2.85,
    toneExposureMul: 3.9,
    ambientTint: "#ecfdf5",
    directionalTint: "#6ee7b7",
  },
};

export type ResolvedSectionLighting = {
  environmentEnabled: boolean;
  environmentIntensity: number;
  ambientIntensity: number;
  directionalIntensity: number;
  toneMappingExposure: number;
  ambientColor: THREE.Color;
  directionalColor: THREE.Color;
};

const BRIGHT_SCROLL_SECTIONS = new Set<CvSectionId>([
  "experience",
  "education",
  "skills",
  "projects",
  "contact",
]);

/** Pisos mínimos quando `NEXT_PUBLIC_WORLD_*` está muito escuro no `.env`. */
const SECTION_LIGHTING_FLOORS: Partial<
  Record<
    CvSectionId,
    Pick<
      ResolvedSectionLighting,
      | "environmentIntensity"
      | "ambientIntensity"
      | "directionalIntensity"
      | "toneMappingExposure"
    >
  >
> = {
  experience: {
    environmentIntensity: 0.2,
    ambientIntensity: 0.47,
    directionalIntensity: 0.52,
    toneMappingExposure: 0.82,
  },
};

function tintFromSection(id: CvSectionId, kind: "ambient" | "directional"): THREE.Color {
  const mod = CV_SECTION_LIGHTING_MODIFIERS[id];
  const hex =
    kind === "ambient"
      ? (mod.ambientTint ?? getCvSectionById(id).color)
      : (mod.directionalTint ?? getCvSectionById(id).color);
  const c = new THREE.Color(hex);
  const bright = BRIGHT_SCROLL_SECTIONS.has(id);
  const whiteMix = bright
    ? id === "experience"
      ? kind === "ambient"
          ? 0.9
          : 0.7
      : kind === "ambient"
        ? 0.86
        : 0.58
    : kind === "ambient"
      ? 0.72
      : 0.35;
  c.lerp(new THREE.Color("#ffffff"), whiteMix);
  return c;
}

function applyLightingFloors(
  sectionId: CvSectionId,
  values: ResolvedSectionLighting
): ResolvedSectionLighting {
  const floor = SECTION_LIGHTING_FLOORS[sectionId];
  if (!floor) return values;

  return {
    ...values,
    environmentIntensity: Math.max(values.environmentIntensity, floor.environmentIntensity ?? 0),
    ambientIntensity: Math.max(values.ambientIntensity, floor.ambientIntensity ?? 0),
    directionalIntensity: Math.max(
      values.directionalIntensity,
      floor.directionalIntensity ?? 0
    ),
    toneMappingExposure: Math.max(values.toneMappingExposure, floor.toneMappingExposure ?? 0),
  };
}

export function resolveSectionLighting(sectionId: CvSectionId): ResolvedSectionLighting {
  const base = getBlenderLightingFromEnv();
  const mod = CV_SECTION_LIGHTING_MODIFIERS[sectionId];
  const toneMul = mod.toneExposureMul ?? 1;

  return applyLightingFloors(sectionId, {
    environmentEnabled: base.environmentEnabled,
    environmentIntensity: base.environmentIntensity * mod.envMul,
    ambientIntensity: base.ambientIntensity * mod.ambientMul,
    directionalIntensity: base.directionalIntensity * mod.directionalMul,
    toneMappingExposure: base.toneMappingExposure * toneMul,
    ambientColor: tintFromSection(sectionId, "ambient"),
    directionalColor: tintFromSection(sectionId, "directional"),
  });
}
