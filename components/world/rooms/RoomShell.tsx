"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import type { Group } from "three";
import type { CvSectionConfig } from "@/world/cv-sections";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { useWorldThemeColors } from "@/hooks/useWorldThemeColors";
import { WorldMaterial } from "../WorldMaterial";

type Props = {
  config: CvSectionConfig;
  active: boolean;
  onSelect: () => void;
  children: ReactNode;
};

export function RoomShell({ config, active, onSelect, children }: Props) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const paused = useWorldPaused();
  const theme = useWorldThemeColors();

  const scale = active ? 1.06 : hovered ? 1.03 : 1;

  useFrame(() => {
    if (paused || !group.current) return;
    group.current.position.y = Math.sin(performance.now() * 0.0009 + config.position[0]) * 0.035;
  });

  const handlers = {
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onSelect();
    },
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHovered(false);
      document.body.style.cursor = "default";
    },
  };

  return (
    <group ref={group} position={[config.position[0], 0, config.position[2]]} scale={scale}>
      <mesh position={[0, 0.2, 0]} {...handlers}>
        <cylinderGeometry args={[1.15, 1.28, 0.42, 12]} />
        <WorldMaterial color={theme.isDark ? "#1e293b" : "#cbd5e1"} />
      </mesh>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.1, 12]} />
        <WorldMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={active ? 0.22 : hovered ? 0.12 : 0.04}
        />
      </mesh>
      <group position={[0, 0.52, 0]}>{children}</group>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.05, 1.35, 24]} />
        <WorldMaterial
          color={config.color}
          transparent
          opacity={active ? 0.35 : 0.18}
          emissive={config.color}
          emissiveIntensity={active ? 0.15 : 0}
        />
      </mesh>
    </group>
  );
}
