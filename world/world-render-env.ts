import type { WorldQuality } from "@/hooks/useWorldQuality";
import {
  WORLD_EDUCATION_DPR_BOOST_STEP,
  WORLD_EDUCATION_DPR_MAX,
  WORLD_EDUCATION_QUALITY_BOOST_MAX,
  WORLD_ENV_MAP_RESOLUTION_HIGH,
  WORLD_ENV_MAP_RESOLUTION_LOW,
  WORLD_IDLE_DPR_HIGH,
  WORLD_IDLE_DPR_LOW,
  WORLD_SCENE_CULL_RADIUS_HIGH,
  WORLD_SCENE_CULL_RADIUS_LOW,
} from "@/world/constants";

function parseEnvFloat(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * DPR do canvas 3D; overrides via `NEXT_PUBLIC_WORLD_DPR_*`.
 * `educationBoost` (0…MAX) só deve ser > 0 na secção Education em desktop.
 */
export function getWorldCanvasDpr(
  quality: WorldQuality,
  educationBoost = 0,
): number | [number, number] {
  if (quality === "low") {
    return parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_DPR_IDLE, WORLD_IDLE_DPR_LOW);
  }

  const min = parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_DPR_MIN, WORLD_IDLE_DPR_HIGH[0]);
  const baseMax = parseEnvFloat(process.env.NEXT_PUBLIC_WORLD_DPR_MAX, WORLD_IDLE_DPR_HIGH[1]);
  const boost = Math.max(0, Math.min(WORLD_EDUCATION_QUALITY_BOOST_MAX, Math.round(educationBoost)));
  const boostedMax = Math.min(
    WORLD_EDUCATION_DPR_MAX,
    baseMax + boost * WORLD_EDUCATION_DPR_BOOST_STEP,
  );
  const max = Math.max(min, boostedMax);
  return [Math.min(min, max), max] as [number, number];
}

function parseEnvInt(raw: string | undefined, fallback: number): number {
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** Resolução do IBL (menor = menos VRAM). */
export function getWorldEnvMapResolution(quality: WorldQuality): number {
  const fallback = quality === "low" ? WORLD_ENV_MAP_RESOLUTION_LOW : WORLD_ENV_MAP_RESOLUTION_HIGH;
  return parseEnvInt(process.env.NEXT_PUBLIC_WORLD_ENV_RESOLUTION, fallback);
}

/** Raio de culling de meshes por secção CV. `0` desliga o cull. */
export function getWorldSceneCullRadius(quality: WorldQuality): number {
  const raw = process.env.NEXT_PUBLIC_WORLD_SCENE_CULL_RADIUS?.trim();
  if (raw === "0") return Infinity;
  const fallback = quality === "low" ? WORLD_SCENE_CULL_RADIUS_LOW : WORLD_SCENE_CULL_RADIUS_HIGH;
  return parseEnvFloat(raw, fallback);
}
