"use client";

import { useWorldThemeColors } from "@/hooks/useWorldThemeColors";
import { WorldMaterial } from "../WorldMaterial";

type Props = { active: boolean; accent: string };

const SCREEN = "#22d3ee";

export function RoomLab({ active, accent }: Props) {
  const theme = useWorldThemeColors();

  return (
    <group>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.35]} />
        <WorldMaterial color={theme.muted} />
      </mesh>
      <mesh position={[0, 0.48, -0.02]}>
        <boxGeometry args={[0.62, 0.42, 0.08]} />
        <WorldMaterial color={theme.foreground} />
      </mesh>
      <mesh position={[0, 0.48, 0.05]}>
        <planeGeometry args={[0.5, 0.32]} />
        <WorldMaterial
          color={SCREEN}
          emissive={SCREEN}
          emissiveIntensity={active ? 0.5 : 0.22}
        />
      </mesh>
      <mesh position={[0.28, 0.62, 0.08]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <WorldMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}
