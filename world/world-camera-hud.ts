/**
 * HUD de debug (FPS, triângulos, coords da câmara).
 * Desligado por defeito — activar com `NEXT_PUBLIC_WORLD_CAMERA_HUD=1`.
 */
export function isWorldCameraCoordsHudEnabled(): boolean {
  return process.env.NEXT_PUBLIC_WORLD_CAMERA_HUD === "1";
}
