"use client";

import { WorldMaterial } from "../WorldMaterial";

const BLOCKS = [
  { x: -0.35, color: "#8b5cf6" },
  { x: 0, color: "#6366f1" },
  { x: 0.35, color: "#4f46e5" },
] as const;

type Props = { active: boolean };

export function RoomProjects({ active }: Props) {
  return (
    <group>
      {BLOCKS.map((b) => (
        <mesh key={b.x} position={[b.x, 0.32, 0]}>
          <boxGeometry args={[0.2, 0.28, 0.2]} />
          <WorldMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={active ? 0.32 : 0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
