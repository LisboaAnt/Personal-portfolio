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

function parseEnvBool(raw: string | undefined, fallback: boolean): boolean {
  if (raw === undefined || raw.trim() === "") return fallback;
  const v = raw.trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes") return true;
  if (v === "0" || v === "false" || v === "no") return false;
  return fallback;
}

export type BlenderLightingEnv = {
  toneMappingExposure: number;
  environmentEnabled: boolean;
  environmentIntensity: number;
  ambientIntensity: number;
  directionalIntensity: number;
  sceneBackground?: string;
  postFxEnabled: boolean;
  bloomIntensity: number;
  bloomThreshold: number;
  vignetteDarkness: number;
};

export function getBlenderLightingFromEnv(): BlenderLightingEnv {
  const environmentIntensity = parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_ENV_INTENSITY, 0.4);
  const sceneBackground = process.env.NEXT_PUBLIC_WORLD_SCENE_BACKGROUND?.trim();

  return {
    toneMappingExposure: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_TONE_EXPOSURE, 0.7),
    environmentEnabled: environmentIntensity > 0,
    environmentIntensity,
    ambientIntensity: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_AMBIENT_INTENSITY, 0.25),
    directionalIntensity: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_DIR_LIGHT_1, 0.45),
    sceneBackground: sceneBackground || undefined,
    postFxEnabled: parseEnvBool(process.env.NEXT_PUBLIC_WORLD_POST_FX, false),
    bloomIntensity: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_BLOOM_INTENSITY, 0.35),
    bloomThreshold: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_BLOOM_THRESHOLD, 0.82),
    vignetteDarkness: parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_VIGNETTE_DARKNESS, 0.42),
  };
}
