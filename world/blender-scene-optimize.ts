import type { Material, Object3D, Texture } from "three";
import { Color, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, SRGBColorSpace } from "three";
import { applyPaintStyle } from "@/world/blender-painted-materials";
import { tuneBlenderImportedScene } from "@/world/blender-material-tune";

/**
 * Pipeline mínimo após useGLTF:
 * 1. Desliga luzes embutidas no GLB (a cena usa Environment HDR + lights R3F)
 * 2. applyPaintStyle — só pinceladas Tilt Brush (`lambert2SG`), nunca Materiais/Cubo/Plano
 * 3. Garante colorSpace sRGB nas texturas de albedo
 * 4. Patch pontual: placas bronze exportadas SEM baseColorTexture (bug do bake/export)
 *
 * NÃO sobrescreve metalness/roughness/normalMap dos materiais PBR baked.
 */

const BRONZE_ALBEDO = new Color(0x6b3f1e);

function isPbr(mat: Material): mat is MeshStandardMaterial | MeshPhysicalMaterial {
  return mat instanceof MeshStandardMaterial || mat instanceof MeshPhysicalMaterial;
}

/** Materiais.038/039 — metalness~0.92 no GLB, mas sem imagem de Base Color baked. */
function patchMissingBronzeAlbedo(mat: MeshStandardMaterial | MeshPhysicalMaterial) {
  const name = mat.name.toLowerCase();
  if (!/materiais\.03[89]/.test(name)) return;
  if (mat.map) return; // bake presente — não tocar

  mat.color.copy(BRONZE_ALBEDO);
  // Respeita valores do Blender se existirem; só preenche buracos
  if (!Number.isFinite(mat.metalness) || mat.metalness < 0.5) mat.metalness = 1;
  if (!Number.isFinite(mat.roughness) || mat.roughness <= 0) mat.roughness = 0.45;
  mat.transparent = false;
  mat.opacity = 1;
  mat.alphaTest = 0;
  mat.depthWrite = true;
  mat.toneMapped = true;
  mat.needsUpdate = true;
}

function ensureTextureColorSpaces(mat: Material) {
  const record = mat as Material & Record<string, Texture | undefined>;
  for (const key of ["map", "emissiveMap"] as const) {
    const tex = record[key];
    if (!tex?.isTexture) continue;
    tex.colorSpace = SRGBColorSpace;
    tex.needsUpdate = true;
  }
}

/**
 * Ajustes únicos após carregar o GLB.
 * Pass-through para PBR baked (pedra, chão, placas com textura).
 */
export function optimizeBlenderImportedScene(root: Object3D) {
  tuneBlenderImportedScene(root, 0);

  // Tilt Brush only — blacklist cobre Cubo/Plano/Materiais/Texto
  applyPaintStyle(root, { alphaTest: 0.5 });

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.frustumCulled = true;

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!mat) continue;
      ensureTextureColorSpaces(mat);
      if (isPbr(mat)) patchMissingBronzeAlbedo(mat);
    }
  });
}
