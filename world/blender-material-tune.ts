import type { Object3D } from "three";
import { Color, Light, Mesh, MeshPhysicalMaterial, MeshStandardMaterial } from "three";

/** Desliga luzes do .glb; lâmpadas coloridas ficam só com emissive (sem IBL a lavar). */
export function tuneBlenderImportedScene(root: Object3D, gltfLightScale: number) {
  root.traverse((obj) => {
    if (obj instanceof Light) {
      if (gltfLightScale <= 0) obj.visible = false;
      else obj.intensity *= gltfLightScale;
      return;
    }

    if (!(obj instanceof Mesh)) return;

    const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of materials) {
      if (!(mat instanceof MeshStandardMaterial) && !(mat instanceof MeshPhysicalMaterial)) {
        continue;
      }
      if (!(mat.emissive instanceof Color)) continue;

      const hsl = { h: 0, s: 0, l: 0 };
      mat.emissive.getHSL(hsl);
      // Lâmpada / glow colorido (laranja, etc.)
      if (hsl.s < 0.2) continue;

      mat.envMapIntensity = 0;
      mat.metalness = 0;
      mat.roughness = 1;
      mat.toneMapped = false;
      mat.needsUpdate = true;
    }
  });
}
