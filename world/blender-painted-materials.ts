import type { Object3D, Texture } from "three";
import { Color, Material, Mesh, MeshBasicMaterial, SRGBColorSpace } from "three";

export type PaintStyleOptions = {
  alphaTest: number;
};

function setSrgb(tex: Texture) {
  tex.colorSpace = SRGBColorSpace;
}

/** Só pinceladas com transparência → unlit (ignora luzes da cena). */
function isPaintStroke(mat: Material): boolean {
  if (!("map" in mat) || !mat.map) return false;
  const transparent = "transparent" in mat && mat.transparent === true;
  const alphaMap = "alphaMap" in mat && !!mat.alphaMap;
  return transparent || alphaMap;
}

function toUnlit(mat: Material, alphaTest: number): MeshBasicMaterial | null {
  if (!("map" in mat) || !mat.map) return null;

  setSrgb(mat.map);
  const alphaMap = "alphaMap" in mat && mat.alphaMap ? mat.alphaMap : null;
  if (alphaMap) setSrgb(alphaMap);

  return new MeshBasicMaterial({
    map: mat.map,
    alphaMap,
    alphaTest,
    transparent: false,
    depthWrite: true,
    side: mat.side,
    toneMapped: true,
    color: new Color(0xffffff),
    fog: mat.fog,
  });
}

export function applyPaintStyle(root: Object3D, opts: PaintStyleOptions) {
  root.traverse((obj) => {
    if (!(obj instanceof Mesh)) return;

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    const next = mats.map((mat) => {
      if (!mat || !isPaintStroke(mat)) return mat;
      return toUnlit(mat, opts.alphaTest) ?? mat;
    });

    obj.material = Array.isArray(obj.material) ? next : next[0]!;
  });
}
