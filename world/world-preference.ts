/** Sessão: utilizador activou o mundo 3D */
export const WORLD_STORAGE_ON = "portfolio-world-3d";

/** Sessão: utilizador desactivou explicitamente (modo clássico) */
export const WORLD_STORAGE_OFF = "portfolio-world-3d-off";

export const WORLD_PREFERENCE_EVENT = "portfolio:world-preference";

export function dispatchWorldPreferenceChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(WORLD_PREFERENCE_EVENT));
}

export function readWorldPreference(): { on: boolean; off: boolean } {
  if (typeof window === "undefined") return { on: false, off: false };
  try {
    return {
      on: sessionStorage.getItem(WORLD_STORAGE_ON) === "1",
      off: sessionStorage.getItem(WORLD_STORAGE_OFF) === "1",
    };
  } catch {
    return { on: false, off: false };
  }
}

export function setWorld3DEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) {
      sessionStorage.setItem(WORLD_STORAGE_ON, "1");
      sessionStorage.removeItem(WORLD_STORAGE_OFF);
    } else {
      sessionStorage.setItem(WORLD_STORAGE_OFF, "1");
      sessionStorage.removeItem(WORLD_STORAGE_ON);
    }
  } catch {
    /* ignore */
  }
  dispatchWorldPreferenceChange();
}

/** `NEXT_PUBLIC_WORLD_3D_MOBILE=0` desliga 3D em viewports estreitas. */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export function isWorldBlockedOnMobile(): boolean {
  if (process.env.NEXT_PUBLIC_WORLD_3D_MOBILE === "1") return false;
  if (process.env.NEXT_PUBLIC_WORLD_3D_MOBILE === "0") return isMobileViewport();
  return false;
}

export function resolveWorld3DRequested(): boolean {
  if (process.env.NEXT_PUBLIC_WORLD_3D === "1") return true;
  if (process.env.NEXT_PUBLIC_WORLD_3D === "0") return false;
  if (process.env.NEXT_PUBLIC_WORLD_SCENE !== "code") return true;

  const pref = readWorldPreference();
  if (pref.off) return false;
  if (pref.on) return true;

  if (typeof window === "undefined") return false;

  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("world") === "1") {
      setWorld3DEnabled(true);
      return true;
    }
  } catch {
    /* ignore */
  }

  return false;
}
