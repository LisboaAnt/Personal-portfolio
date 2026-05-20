"use client";

import { useWorldThemeColors } from "@/hooks/useWorldThemeColors";

export function WorldLighting() {
  const theme = useWorldThemeColors();

  return (
    <>
      <ambientLight intensity={theme.isDark ? 0.55 : 0.72} color={theme.foreground} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={theme.isDark ? 1.1 : 0.95}
        color={theme.accent}
      />
      <directionalLight
        position={[-5, 9, -4]}
        intensity={0.28}
        color={theme.isDark ? "#c4b5fd" : "#a5b4fc"}
      />
      <pointLight
        position={[0, 3, 2]}
        intensity={theme.isDark ? 0.35 : 0.2}
        color={theme.accent}
        distance={18}
      />
    </>
  );
}
