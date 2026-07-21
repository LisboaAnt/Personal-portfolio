import type { Material, Object3D, Texture } from "three";
import { Color, Mesh, MeshBasicMaterial, MeshStandardMaterial, SRGBColorSpace } from "three";

export type PaintStyleOptions = {
  alphaTest: number;
};

/**
 * applyPaintStyle existe para pinceladas Tilt Brush (mundo pintado).
 * NÃO deve tocar em:
 * - placas de bronze (Materiais.038/039, Cubo/Plano com bake)
 * - pedestais de pedra (Materiais.001)
 * - chão baked (BakeLab)
 * - texto, stands, frames
 */

const EXCLUDED_MATERIAL =
  /materiais|material\.|lambert2sg\.|bronze|placa|brass|stand|picture|frame|wood|balloon|gift|flame|candle|cake|wall|table|scene_-_root|aisstandardsurface|svgmat|gradient/i;

const EXCLUDED_MESH =
  /\bcubo|\bplano|\btexto|\bfloor|\bquadro|\bstand|\bcylinder|\bplane_|\btrim|\bwall|\btable|\bgift|\bballoon|\bcake|\bcandle|bronze|placa|terra|ground/i;

function collectNames(obj: Object3D): string {
  const names: string[] = [];
  let cur: Object3D | null = obj;
  while (cur) {
    if (cur.name) names.push(cur.name);
    cur = cur.parent;
  }
  return names.join(" ").toLowerCase();
}

/** true = não converter para MeshBasicMaterial */
export function isPaintStyleExcluded(mesh: Mesh, mat: Material): boolean {
  if (EXCLUDED_MATERIAL.test(mat.name)) return true;
  if (EXCLUDED_MESH.test(collectNames(mesh))) return true;

  // Qualquer PBR com normal/metalness map = asset baked, não pincelada
  if (mat instanceof MeshStandardMaterial) {
    if (mat.normalMap || mat.metalnessMap || mat.roughnessMap) return true;
    if (mat.metalness >= 0.15) return true;
  }

  return false;
}

/** Só o material exacto `lambert2SG` (Tilt Brush), sem sufixos. */
export function isPaintStrokeMaterial(mesh: Mesh, mat: Material): boolean {
  if (mat.name.toLowerCase() !== "lambert2sg") return false;
  if (isPaintStyleExcluded(mesh, mat)) return false;
  const map = (mat as MeshStandardMaterial).map;
  return !!map?.isTexture;
}

function setSrgb(tex: Texture) {
  tex.colorSpace = SRGBColorSpace;
}

function getTexture(mat: Material, key: "map" | "alphaMap"): Texture | null {
  const record = mat as Material & { map?: Texture; alphaMap?: Texture };
  const tex = record[key];
  return tex?.isTexture ? tex : null;
}

function toUnlit(mat: Material, alphaTest: number): MeshBasicMaterial | null {
  const map = getTexture(mat, "map");
  if (!map) return null;

  setSrgb(map);
  const alphaMap = getTexture(mat, "alphaMap");
  if (alphaMap) setSrgb(alphaMap);

  const fog = "fog" in mat && typeof mat.fog === "boolean" ? mat.fog : true;
  const baseColor =
    "color" in mat && mat.color instanceof Color ? mat.color.clone() : new Color(0xffffff);

  return new MeshBasicMaterial({
    map,
    ...(alphaMap ? { alphaMap } : {}),
    alphaTest,
    transparent: false,
    depthWrite: true,
    side: mat.side,
    toneMapped: true,
    color: baseColor,
    fog,
  });
}

export function applyPaintStyle(root: Object3D, opts: PaintStyleOptions) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    const next = mats.map((mat) => {
      if (!mat || isPaintStyleExcluded(obj, mat) || !isPaintStrokeMaterial(obj, mat)) {
        return mat;
      }
      return toUnlit(mat, opts.alphaTest) ?? mat;
    });

    obj.material = Array.isArray(obj.material) ? next : next[0]!;
  });
}
