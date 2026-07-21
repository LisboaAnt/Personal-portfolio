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
  /** Experiência e secções seguintes — mesma iluminação no scroll. */
  experience: {
    envMul: 2.2,
    ambientMul: 1.85,
    directionalMul: 1.65,
    toneExposureMul: 1.75,
    ambientTint: "#fffbeb",
    directionalTint: "#fde68a",
  },
  education: {
    envMul: 1.35,
    ambientMul: 1.15,
    directionalMul: 1.1,
    toneExposureMul: 1.15,
    ambientTint: "#f5f0e6",
    directionalTint: "#efe6d4",
  },
  skills: {
    envMul: 2.2,
    ambientMul: 1.85,
    directionalMul: 1.65,
    toneExposureMul: 1.75,
    ambientTint: "#fffbeb",
    directionalTint: "#fde68a",
  },
  projects: {
    envMul: 2.2,
    ambientMul: 1.85,
    directionalMul: 1.65,
    toneExposureMul: 1.75,
    ambientTint: "#fffbeb",
    directionalTint: "#fde68a",
  },
  contact: {
    envMul: 2.2,
    ambientMul: 1.85,
    directionalMul: 1.65,
    toneExposureMul: 1.75,
    ambientTint: "#fffbeb",
    directionalTint: "#fde68a",
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
  education: {
    environmentIntensity: 0.2,
    ambientIntensity: 0.47,
    directionalIntensity: 0.52,
    toneMappingExposure: 0.82,
  },
  skills: {
    environmentIntensity: 0.2,
    ambientIntensity: 0.47,
    directionalIntensity: 0.52,
    toneMappingExposure: 0.82,
  },
  projects: {
    environmentIntensity: 0.2,
    ambientIntensity: 0.47,
    directionalIntensity: 0.52,
    toneMappingExposure: 0.82,
  },
  contact: {
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
    ? kind === "ambient"
      ? 0.9
      : 0.7
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

function lerpNumber(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpSectionLighting(
  fromId: CvSectionId,
  toId: CvSectionId,
  t: number,
): ResolvedSectionLighting {
  const a = resolveSectionLighting(fromId);
  const b = resolveSectionLighting(toId);
  const ambientColor = a.ambientColor.clone().lerp(b.ambientColor, t);
  const directionalColor = a.directionalColor.clone().lerp(b.directionalColor, t);

  return {
    environmentEnabled: b.environmentEnabled,
    environmentIntensity: lerpNumber(a.environmentIntensity, b.environmentIntensity, t),
    ambientIntensity: lerpNumber(a.ambientIntensity, b.ambientIntensity, t),
    directionalIntensity: lerpNumber(a.directionalIntensity, b.directionalIntensity, t),
    toneMappingExposure: lerpNumber(a.toneMappingExposure, b.toneMappingExposure, t),
    ambientColor,
    directionalColor,
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
