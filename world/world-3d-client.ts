import { isWorldBlockedOnMobile, resolveWorld3DRequested } from "./world-preference";

export function resolveWorldEnabledOnClient(): boolean {
  if (typeof window === "undefined") return false;
  const requested = resolveWorld3DRequested();
  return requested && !isWorldBlockedOnMobile();
}

/** Valor inicial alinhado SSR ↔ primeiro paint no cliente (evita `null` → mismatch de filhos). */
export function resolveWorldEnabledInitial(): boolean {
  if (typeof window === "undefined") {
    return resolveWorld3DRequested();
  }
  return resolveWorldEnabledOnClient();
}

export function detectWebGLOnClient(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}
