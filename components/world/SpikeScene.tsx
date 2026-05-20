"use client";

import { useMemo, useState } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { SpikeIsland } from "./SpikeIsland";
import { SPIKE_DEFAULT_CAMERA, SPIKE_ISLANDS } from "@/world/spike-islands";
import type { SpikeIslandId } from "@/world/types";

export function SpikeScene() {
  const [activeId, setActiveId] = useState<SpikeIslandId | null>(null);

  const cameraPose = useMemo(() => {
    if (!activeId) return SPIKE_DEFAULT_CAMERA;
    return SPIKE_ISLANDS.find((i) => i.id === activeId)?.camera ?? SPIKE_DEFAULT_CAMERA;
  }, [activeId]);

  return (
    <>
      <color attach="background" args={["#070b14"]} />
      <fog attach="fog" args={["#070b14", 12, 28]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} />
      <directionalLight position={[-4, 6, -2]} intensity={0.35} color="#c4b5fd" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#0f172a" roughness={0.95} metalness={0} />
      </mesh>

      <Stars radius={40} depth={30} count={1200} factor={3} saturation={0.2} fade speed={0.4} />

      {SPIKE_ISLANDS.map((island) => (
        <SpikeIsland
          key={island.id}
          config={island}
          active={activeId === island.id}
          onSelect={setActiveId}
        />
      ))}

      <CameraRig pose={cameraPose} duration={1.25} />

      <OrbitControls
        enabled={!activeId}
        enablePan={false}
        minDistance={8}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
}
