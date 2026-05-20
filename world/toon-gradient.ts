import * as THREE from "three";

let cached: THREE.Texture | null = null;

/** Mapa 3 níveis para MeshToonMaterial (estilo LBP). */
export function getToonGradientMap(): THREE.Texture {
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 4, 0);
  g.addColorStop(0, "#3a3a4a");
  g.addColorStop(0.45, "#8a8aa0");
  g.addColorStop(1, "#f0f0ff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 1);

  cached = new THREE.CanvasTexture(canvas);
  cached.minFilter = THREE.NearestFilter;
  cached.magFilter = THREE.NearestFilter;
  cached.generateMipmaps = false;
  return cached;
}
