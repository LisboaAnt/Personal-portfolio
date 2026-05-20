function parseEnvFloat(key: string, fallback: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Escala global do mundo 3D (blender + sketch). Ex.: 2 = dobro do tamanho. */
export function getWorldScaleFromEnv(): number {
  return parseEnvFloat("NEXT_PUBLIC_WORLD_SCALE", 1);
}
