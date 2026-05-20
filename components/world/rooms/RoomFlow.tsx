"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { WorldMaterial } from "../WorldMaterial";

type Props = { active: boolean; accent: string };

const TRAIL = [-0.55, -0.28, 0, 0.28, 0.55];

export function RoomFlow({ active, accent }: Props) {
  const portal = useRef<Group>(null);
  const paused = useWorldPaused();

  useFrame((state) => {
    if (paused || !portal.current) return;
    portal.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.04;
  });

  return (
    <group>
      <group ref={portal}>
        <mesh position={[-0.38, 0.35, 0]}>
          <boxGeometry args={[0.1, 0.7, 0.1]} />
          <WorldMaterial color={accent} emissive={accent} emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0.38, 0.35, 0]}>
          <boxGeometry args={[0.1, 0.7, 0.1]} />
          <WorldMaterial color={accent} emissive={accent} emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0.62, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.38, 0.06, 8, 16, Math.PI]} />
          <WorldMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={active ? 0.4 : 0.18}
          />
        </mesh>
      </group>

      {TRAIL.map((x, i) => (
        <mesh key={x} position={[x, 0.08 + i * 0.02, 0.12]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <WorldMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={active ? 0.3 : 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
