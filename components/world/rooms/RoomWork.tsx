"use client";

import { WorldMaterial } from "../WorldMaterial";

const PROJECTS = [
  { x: -0.42, color: "#8b5cf6", label: "vittahub" },
  { x: 0, color: "#10b981", label: "ussin" },
  { x: 0.42, color: "#6366f1", label: "ufc" },
] as const;

type Props = { active: boolean };

export function RoomWork({ active }: Props) {
  return (
    <group>
      {PROJECTS.map((p) => (
        <group key={p.label} position={[p.x, 0, 0]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.14, 0.16, 0.2, 8]} />
            <WorldMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <boxGeometry args={[0.22, 0.32, 0.22]} />
            <WorldMaterial
              color={p.color}
              emissive={p.color}
              emissiveIntensity={active ? 0.35 : 0.12}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
