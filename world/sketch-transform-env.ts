function parseTriple(key: string, fallback: [number, number, number]): [number, number, number] {
  const raw = process.env[key]?.trim();
  if (!raw) return fallback;
  const parts = raw.split(",").map((s) => Number.parseFloat(s.trim()));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return fallback;
  return [parts[0]!, parts[1]!, parts[2]!];
}

function parseScale(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Posição/escala do sketch.gltf quando usado com blender.glb (`both`). */
export function getSketchTransformFromEnv() {
  return {
    position: parseTriple("NEXT_PUBLIC_WORLD_SKETCH_POSITION", [0, 0, 0]),
    rotation: parseTriple("NEXT_PUBLIC_WORLD_SKETCH_ROTATION", [0, 0, 0]),
    scale: parseScale("NEXT_PUBLIC_WORLD_SKETCH_SCALE", 1),
  };
}
