"use client";

import { Stars } from "@react-three/drei";
import { useWorldThemeColors } from "@/hooks/useWorldThemeColors";

type Props = {
  /** Com cena Blender: só céu/nevoeiro — chão e estrelas vêm do .glb */
  minimal?: boolean;
  /** Sem cor de fundo nem nevoeiro (canvas transparente). */
  transparent?: boolean;
};

export function WorldEnvironment({ minimal = false, transparent = false }: Props) {
  const theme = useWorldThemeColors();

  if (transparent) return null;

  return (
    <>
      <color attach="background" args={[theme.surface]} />
      {!minimal ? (
        <fog attach="fog" args={[theme.surface, 12, theme.isDark ? 34 : 38]} />
      ) : null}

      {!minimal ? (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
            <planeGeometry args={[36, 36]} />
            <meshStandardMaterial
              color={theme.isDark ? "#0c1222" : "#e2e8f5"}
              roughness={0.98}
              metalness={0}
            />
          </mesh>

          {theme.isDark ? (
            <Stars radius={48} depth={42} count={900} factor={2.2} saturation={0.12} fade speed={0.25} />
          ) : (
            <Stars radius={52} depth={50} count={280} factor={1.4} saturation={0.05} fade speed={0.12} />
          )}
        </>
      ) : null}
    </>
  );
}
