import type { Material, Object3D, Texture } from "three";
import { Color, Mesh, MeshBasicMaterial, SRGBColorSpace } from "three";

export type PaintStyleOptions = {
  alphaTest: number;
};

function setSrgb(tex: Texture) {
  tex.colorSpace = SRGBColorSpace;
}

function getTexture(mat: Material, key: "map" | "alphaMap"): Texture | null {
  const record = mat as Material & { map?: Texture; alphaMap?: Texture };
  const tex = record[key];
  return tex?.isTexture ? tex : null;
}

/** Só pinceladas com transparência → unlit (ignora luzes da cena). */
function isPaintStroke(mat: Material): boolean {
  if (!getTexture(mat, "map")) return false;
  const transparent = "transparent" in mat && mat.transparent === true;
  const alphaMap = !!getTexture(mat, "alphaMap");
  return transparent || alphaMap;
}

function toUnlit(mat: Material, alphaTest: number): MeshBasicMaterial | null {
  const map = getTexture(mat, "map");
  if (!map) return null;

  setSrgb(map);
  const alphaMap = getTexture(mat, "alphaMap");
  if (alphaMap) setSrgb(alphaMap);

  const fog = "fog" in mat && typeof mat.fog === "boolean" ? mat.fog : true;

  return new MeshBasicMaterial({
    map,
    ...(alphaMap ? { alphaMap } : {}),
    alphaTest,
    transparent: false,
    depthWrite: true,
    side: mat.side,
    toneMapped: true,
    color: new Color(0xffffff),
    fog,
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
