/**
 * Iluminação do `blender.glb`.
 * No cliente Next.js só funcionam acessos estáticos a `process.env.NEXT_PUBLIC_*`
 * (não uses `process.env[nomeVariavel]`).
 */

function parseEnvFloat(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function getBlenderLightingFromEnv() {
  const environmentIntensity = parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_ENV_INTENSITY, 0.4);

  return {
    toneMappingExposure: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_TONE_EXPOSURE, 0.7),
    environmentEnabled: environmentIntensity > 0,
    environmentIntensity,
    ambientIntensity: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_AMBIENT_INTENSITY, 0.25),
    directionalIntensity: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_DIR_LIGHT_1, 0.45),
  };
}
