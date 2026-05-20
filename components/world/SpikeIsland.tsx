"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import type { SpikeIslandConfig } from "@/world/types";

type Props = {
  config: SpikeIslandConfig;
  active: boolean;
  onSelect: (id: SpikeIslandConfig["id"]) => void;
};

export function SpikeIsland({ config, active, onSelect }: Props) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const base = config.position[1];
    mesh.current.position.y =
      base + Math.sin(performance.now() * 0.001 + config.position[0]) * 0.06;
    mesh.current.rotation.y += delta * 0.15;
  });

  const scale = active ? 1.15 : hovered ? 1.08 : 1;

  return (
    <group position={[config.position[0], 0, config.position[2]]}>
      <mesh
        ref={mesh}
        position={[0, config.position[1], 0]}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(config.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial color={config.color} roughness={0.65} metalness={0.15} />
      </mesh>
      <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.1, 32]} />
        <meshStandardMaterial color={config.color} transparent opacity={0.25} roughness={1} />
      </mesh>
    </group>
  );
}
