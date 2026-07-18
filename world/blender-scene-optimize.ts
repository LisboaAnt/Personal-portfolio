import type { Material, Object3D, Texture } from "three";
import { LinearFilter, Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";
import { applyPaintStyle } from "@/world/blender-painted-materials";
import { tuneBlenderImportedScene } from "@/world/blender-material-tune";

const TEXTURE_KEYS = [
  "map",
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "aoMap",
  "emissiveMap",
  "alphaMap",
] as const;

function optimizeMaterialTextures(mat: Material) {
  for (const key of TEXTURE_KEYS) {
    const tex = (mat as Material & Record<string, Texture | undefined>)[key];
    if (!tex?.isTexture) continue;
    tex.anisotropy = 1;
    tex.generateMipmaps = false;
    tex.minFilter = LinearFilter;
    tex.needsUpdate = true;
  }

  if (mat instanceof MeshStandardMaterial || mat instanceof MeshPhysicalMaterial) {
    mat.envMapIntensity = Math.min(mat.envMapIntensity, 0.85);
    mat.needsUpdate = true;
  }
}

/** Ajustes únicos após carregar o GLB — menos VRAM e shading mais barato. */
export function optimizeBlenderImportedScene(root: Object3D) {
  tuneBlenderImportedScene(root, 0);
  applyPaintStyle(root, { alphaTest: 0.5 });

  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;
    obj.frustumCulled = true;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (mat) optimizeMaterialTextures(mat);
    }
  });
}
