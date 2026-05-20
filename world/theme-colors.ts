/** Tokens lidos de `app/globals.css` para o mundo 3D. */
export type WorldThemeColors = {
  surface: string;
  surfaceElevated: string;
  foreground: string;
  muted: string;
  accent: string;
  isDark: boolean;
};

const VARS = {
  surface: "--surface",
  surfaceElevated: "--surface-elevated",
  foreground: "--foreground",
  muted: "--muted",
  accent: "--accent",
} as const;

function readVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** THREE.Color só aceita #RGB / #RRGGBB — normaliza rgba e hex com alpha. */
function toThreeHex(color: string, fallback: string): string {
  const c = color.trim();
  if (/^#[0-9a-fA-F]{8}$/.test(c)) return c.slice(0, 7);
  if (/^#[0-9a-fA-F]{6}$/.test(c) || /^#[0-9a-fA-F]{3}$/.test(c)) return c;
  const rgb = c.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) {
    const hex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, "0");
    return `#${hex(Number(rgb[1]))}${hex(Number(rgb[2]))}${hex(Number(rgb[3]))}`;
  }
  return fallback;
}

const FALLBACK_DARK: WorldThemeColors = {
  surface: "#070b14",
  surfaceElevated: "#0f172a",
  foreground: "#e2e8f0",
  muted: "#94a3b8",
  accent: "#818cf8",
  isDark: true,
};

const FALLBACK_LIGHT: WorldThemeColors = {
  surface: "#f4f6fb",
  surfaceElevated: "#ffffff",
  foreground: "#0f172a",
  muted: "#64748b",
  accent: "#4f46e5",
  isDark: false,
};

export function getWorldThemeColors(): WorldThemeColors {
  if (typeof document === "undefined") return FALLBACK_DARK;

  const isDark = document.documentElement.classList.contains("dark");
  const fallback = isDark ? FALLBACK_DARK : FALLBACK_LIGHT;

  return {
    surface: toThreeHex(readVar(VARS.surface, fallback.surface), fallback.surface),
    surfaceElevated: toThreeHex(
      readVar(VARS.surfaceElevated, fallback.surfaceElevated),
      fallback.surfaceElevated
    ),
    foreground: toThreeHex(readVar(VARS.foreground, fallback.foreground), fallback.foreground),
    muted: toThreeHex(readVar(VARS.muted, fallback.muted), fallback.muted),
    accent: toThreeHex(readVar(VARS.accent, fallback.accent), fallback.accent),
    isDark,
  };
}
