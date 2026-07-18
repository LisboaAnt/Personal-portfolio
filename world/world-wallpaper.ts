import { isBlenderWorldScene } from "./world-scene-mode";

export const WORLD_WALLPAPER_URL = "/world/wallpaper.png";

/** Atraso só para montar o canvas 3D (ms). O wallpaper e o preload do GLB começam antes. */
export const WORLD_BACKGROUND_DELAY_MS = (() => {
  const raw = process.env.NEXT_PUBLIC_WORLD_BACKGROUND_DELAY_MS;
  const fallback = 400;
  if (raw === undefined || raw.trim() === "") return fallback;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  /* Evita valores antigos (ex.: 8500) a adiar o 3D em produção. */
  return Math.min(n, 1200);
})();

/** GLB pronto → mantém wallpaper por cima do canvas (3D “atempera”) antes do fade (ms). */
export const WORLD_WALLPAPER_READY_HOLD_MS = (() => {
  const raw = process.env.NEXT_PUBLIC_WORLD_WALLPAPER_READY_HOLD_MS;
  if (raw === undefined || raw.trim() === "") return 300;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 300;
})();

export const WORLD_WALLPAPER_HTML_CLASS = "world-wallpaper-mode";

export function isWorldWallpaperEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_WORLD_WALLPAPER === "0") return false;
  return isBlenderWorldScene();
}
