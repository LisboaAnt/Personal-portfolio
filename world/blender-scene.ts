import { isCvSectionId } from "./scroll-rooms";
import type { CvSectionId } from "./types";

/** Ficheiro único exportado do Blender → `public/world/blender1.glb` */
export const BLENDER_SCENE_URL = "/world/blender1.glb";

/**
 * Empty no Blender com este prefixo (ex.: `hotspot_profile`).
 * A câmara usa as posições do empty para cliques; sem empties, caem nos defaults de `cv-sections.ts`.
 */
export const BLENDER_HOTSPOT_PREFIX = "hotspot_";

export function getBlenderHotspotName(id: CvSectionId): string {
  return `${BLENDER_HOTSPOT_PREFIX}${id}`;
}

export function parseBlenderHotspotName(name: string): CvSectionId | null {
  if (!name.startsWith(BLENDER_HOTSPOT_PREFIX)) return null;
  const id = name.slice(BLENDER_HOTSPOT_PREFIX.length);
  return isCvSectionId(id) ? id : null;
}

/**
 * Export glTF: incluir empties `hotspot_*`, aplicar transformações (+Y up),
 * escala ~1 unidade = 1 m, origem no centro da linha das ilhas.
 * Materiais: Principled BSDF; texturas ≤1024px; alvo &lt;500k tris no ficheiro todo.
 */
