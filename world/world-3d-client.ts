import {
  isWorld3DCanvasBlockedOnMobile,
  resolveWorld3DRequested,
} from "./world-preference";

/** Modo mundo (scroll CV, wallpaper, nav) — independente do canvas 3D. */
export function resolveWorldEnabledOnClient(): boolean {
  if (typeof window === "undefined") return false;
  return resolveWorld3DRequested();
}

/** Valor inicial alinhado SSR ↔ primeiro paint no cliente. */
export function resolveWorldEnabledInitial(): boolean {
  if (typeof window === "undefined") {
    return resolveWorld3DRequested();
  }
  return resolveWorldEnabledOnClient();
}

/** Canvas WebGL / GLB — desligado no mobile por defeito. */
export function resolveWorldCanvasEnabledOnClient(): boolean {
  if (typeof window === "undefined") return false;
  return resolveWorld3DRequested() && !isWorld3DCanvasBlockedOnMobile();
}

export function detectWebGLOnClient(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}
