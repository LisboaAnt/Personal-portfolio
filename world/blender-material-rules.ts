/**
 * Regras de materiais Blender — API mínima.
 *
 * O pipeline destrutivo de "roles" (stone/bronze overrides) foi removido.
 * Os materiais PBR baked do blender1.glb passam intactos; ver blender-scene-optimize.ts.
 */

import type { Material } from "three";

export function isBronzePlateMaterial(mat: Material): boolean {
  return /materiais\.03[89]/i.test(mat.name);
}

/** @deprecated Mantido para imports antigos — sempre false (já não classificamos paint aqui). */
export function isPaintStrokeMaterial(_mesh: unknown, mat: Material): boolean {
  return mat.name.toLowerCase() === "lambert2sg";
}
