"use client";

import { useWorldThemeColors } from "@/hooks/useWorldThemeColors";
import { WorldMaterial } from "../WorldMaterial";

type Props = { active: boolean; accent: string };

export function RoomContact({ active, accent }: Props) {
  const theme = useWorldThemeColors();

  return (
    <group>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.45, 0.32, 0.3]} />
        <WorldMaterial color={theme.muted} />
      </mesh>
      <mesh position={[0, 0.42, 0.18]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <WorldMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={active ? 0.45 : 0.2}
        />
      </mesh>
    </group>
  );
}
