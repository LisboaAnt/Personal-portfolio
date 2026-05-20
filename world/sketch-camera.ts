import { getWorldScaleFromEnv } from "./world-scale-env";

/** Câmara base para `sketch.gltf` (antes de `WORLD_SCALE`). */
export const SKETCH_VIEW_POSITION: [number, number, number] = [0, 2.2, 9];

export const SKETCH_VIEW_FOV = 45;

/** Recua a câmara quando o mundo está ampliado — evita ficar dentro da malha. */
export function getSketchCameraConfig() {
  const scale = getWorldScaleFromEnv();
  return {
    position: [
      SKETCH_VIEW_POSITION[0] * scale,
      SKETCH_VIEW_POSITION[1] * scale,
      SKETCH_VIEW_POSITION[2] * scale,
    ] as [number, number, number],
    fov: SKETCH_VIEW_FOV,
    far: Math.max(256, 96 * scale),
  };
}
