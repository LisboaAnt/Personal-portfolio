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
  /** Experiência + secções abaixo no scroll: zona mais clara. */
  experience: {
    envMul: 5.2,
    ambientMul: 4,
    directionalMul: 3.2,
    toneExposureMul: 4.5,
    ambientTint: "#fffbeb",
    directionalTint: "#fef08a",
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
        : 0.68
      : kind === "ambient"
        ? 0.86
        : 0.58
    : kind === "ambient"
      ? 0.72
      : 0.35;
  c.lerp(new THREE.Color("#ffffff"), whiteMix);
  return c;
}

export function resolveSectionLighting(sectionId: CvSectionId): ResolvedSectionLighting {
  const base = getBlenderLightingFromEnv();
  const mod = CV_SECTION_LIGHTING_MODIFIERS[sectionId];
  const toneMul = mod.toneExposureMul ?? 1;

  return {
    environmentEnabled: base.environmentEnabled,
    environmentIntensity: base.environmentIntensity * mod.envMul,
    ambientIntensity: base.ambientIntensity * mod.ambientMul,
    directionalIntensity: base.directionalIntensity * mod.directionalMul,
    toneMappingExposure: base.toneMappingExposure * toneMul,
    ambientColor: tintFromSection(sectionId, "ambient"),
    directionalColor: tintFromSection(sectionId, "directional"),
  };
}
