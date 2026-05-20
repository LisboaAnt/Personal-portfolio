"use client";

import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Group } from "three";
import { Light, Object3D, Vector3 } from "three";
import { useGlbAnimationsEnabled } from "@/hooks/useGlbAnimationsEnabled";
import { useWorldNavigate } from "@/hooks/useWorldNavigate";
import { useWorldPaused } from "@/hooks/useWorldPaused";
import { useWorldStore } from "@/stores/world-store";
import { BLENDER_SCENE_URL, parseBlenderHotspotName } from "@/world/blender-scene";
import { CV_SECTIONS } from "@/world/cv-sections";
import { filterCameraAnimationClips } from "@/world/filter-gltf-animations";
import type { CvSectionId } from "@/world/types";

useGLTF.preload(BLENDER_SCENE_URL);

type Hotspot = {
  id: CvSectionId;
  position: [number, number, number];
};

function collectHotspots(root: Object3D): Hotspot[] {
  const found: Hotspot[] = [];
  const pos = new Vector3();

  root.traverse((obj) => {
    const id = parseBlenderHotspotName(obj.name);
    if (!id) return;
    obj.getWorldPosition(pos);
    root.worldToLocal(pos);
    found.push({ id, position: [pos.x, pos.y, pos.z] });
  });

  if (found.length > 0) return found;

  return CV_SECTIONS.map((s) => ({
    id: s.id,
    position: [s.position[0], s.position[1] + 0.5, s.position[2]] as [number, number, number],
  }));
}

type HotspotMeshProps = {
  position: [number, number, number];
  active: boolean;
  onSelect: () => void;
};

function HotspotMesh({ position, active, onSelect }: HotspotMeshProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
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
      <cylinderGeometry args={[1.2, 1.35, 2.4, 12]} />
      <meshBasicMaterial color="#818cf8" transparent opacity={active ? 0.12 : hovered ? 0.08 : 0} depthWrite={false} />
    </mesh>
  );
}

export function WorldBlenderScene() {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(BLENDER_SCENE_URL);
  const safeAnimations = useMemo(() => filterCameraAnimationClips(animations), [animations]);
  const { actions, names } = useAnimations(safeAnimations, group);
  const animationsEnabled = useGlbAnimationsEnabled();
  const paused = useWorldPaused();
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const { goToSection } = useWorldNavigate();

  const hotspots = useMemo(() => collectHotspots(scene), [scene]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof Light) obj.visible = false;
    });
  }, [scene]);

  useEffect(() => {
    if (!animationsEnabled || names.length === 0) return;

    for (const name of names) {
      const action = actions[name];
      if (!action) continue;
      action.reset().setLoop(THREE.LoopRepeat, Infinity).play();
    }

    return () => {
      for (const name of names) {
        actions[name]?.stop();
      }
    };
  }, [actions, animationsEnabled, names]);

  useEffect(() => {
    for (const name of names) {
      const action = actions[name];
      if (action) action.paused = paused || !animationsEnabled;
    }
  }, [actions, animationsEnabled, names, paused]);

  return (
    <group ref={group}>
      <primitive object={scene} />
      {hotspots.map((h) => (
        <HotspotMesh
          key={h.id}
          position={h.position}
          active={focusRoomId === h.id}
          onSelect={() => goToSection(h.id)}
        />
      ))}
    </group>
  );
}
