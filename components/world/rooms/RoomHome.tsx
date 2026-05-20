"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { useWorldThemeColors } from "@/hooks/useWorldThemeColors";
import { WorldMaterial } from "../WorldMaterial";

type Props = { active: boolean; accent: string };

export function RoomHome({ active, accent }: Props) {
  const lamp = useRef<Mesh>(null);
  const paused = useWorldPaused();
  const theme = useWorldThemeColors();

  useFrame((state) => {
    if (paused || !lamp.current) return;
    lamp.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.7, 0.12, 0.45]} />
        <WorldMaterial color={theme.muted} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.55, 0.4, 0.35]} />
        <WorldMaterial color={theme.surfaceElevated} />
      </mesh>
      <mesh position={[-0.22, 0.62, 0.12]}>
        <boxGeometry args={[0.18, 0.14, 0.08]} />
        <WorldMaterial color={theme.foreground} />
      </mesh>
      <mesh ref={lamp} position={[0.42, 0.55, -0.15]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <WorldMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={active ? 0.55 : 0.25}
        />
      </mesh>
      <mesh position={[0.42, 0.38, -0.15]}>
        <cylinderGeometry args={[0.03, 0.04, 0.22, 8]} />
        <WorldMaterial color={theme.muted} />
      </mesh>
    </group>
  );
}
