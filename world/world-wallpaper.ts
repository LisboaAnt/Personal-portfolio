import { isBlenderWorldScene } from "./world-scene-mode";

export const WORLD_WALLPAPER_URL = "/world/wallpaper.png";

/** Atraso só para GLB + canvas 3D (ms). O wallpaper usa CSS no primeiro paint. */
export const WORLD_BACKGROUND_DELAY_MS = (() => {
  const raw = process.env.NEXT_PUBLIC_WORLD_BACKGROUND_DELAY_MS;
  if (raw === undefined || raw.trim() === "") return 1500;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : 1500;
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
