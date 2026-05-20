import type { Object3D } from "three";
import {
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
} from "three";

function sketchBrightness(): number {
  const raw = process.env.NEXT_PUBLIC_WORLD_SKETCH_BRIGHTNESS;
  if (raw === undefined || raw.trim() === "") return 1;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 && n <= 2 ? n : 1;
}

function fixVertexColorSpace(mesh: Mesh) {
  const attr = mesh.geometry.getAttribute("color") ?? mesh.geometry.getAttribute("COLOR_0");
  if (attr && "colorSpace" in attr) {
    attr.colorSpace = SRGBColorSpace;
  }
}

function meshHasVertexColors(mesh: Mesh): boolean {
  return mesh.geometry.hasAttribute("color") || mesh.geometry.hasAttribute("COLOR_0");
}

function toUnlitMaterial(
  mat: MeshStandardMaterial,
  vertexColors: boolean,
  nameHint: string
): MeshBasicMaterial {
  if (mat.map) mat.map.colorSpace = SRGBColorSpace;
  if (mat.alphaMap) mat.alphaMap.colorSpace = SRGBColorSpace;

  const isBlend = mat.transparent && mat.alphaTest === 0;
  const b = sketchBrightness();

  return new MeshBasicMaterial({
    map: mat.map ?? undefined,
    alphaMap: mat.alphaMap ?? undefined,
    vertexColors,
    color: new Color(b, b, b),
    alphaTest: mat.alphaTest > 0 && !mat.transparent ? mat.alphaTest : 0,
    transparent: isBlend,
    opacity: mat.opacity,
    depthWrite: !isBlend,
    side: mat.side,
    toneMapped: false,
    fog: mat.fog,
    name: nameHint,
  });
}

function replaceMeshMaterials(mesh: Mesh) {
  fixVertexColorSpace(mesh);
  const vertexColors = meshHasVertexColors(mesh);
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

  const next = materials.map((mat) => {
    if (!mat) return mat;

    if (mat instanceof MeshBasicMaterial) {
      if (vertexColors) mat.vertexColors = true;
      mat.toneMapped = false;
      const b = sketchBrightness();
      mat.color.setRGB(b, b, b);
      mat.needsUpdate = true;
      return mat;
    }

    if (mat instanceof MeshStandardMaterial) {
      return toUnlitMaterial(mat, vertexColors, mat.name || mesh.name);
    }

    return mat;
  });

  mesh.material = Array.isArray(mesh.material) ? next : next[0]!;
}

/** Tilt Brush: cores nos vértices + textura; sem ACES (evita lavar a branco). */
export function fixTiltBrushMaterials(root: Object3D) {
  root.traverse((obj) => {
    if (obj instanceof Mesh) replaceMeshMaterials(obj);
  });
}
