"use client";

import type { CvSectionConfig } from "@/world/cv-sections";
import { ROOM_DIORAMAS, RoomShell } from "./rooms";

type Props = {
  config: CvSectionConfig;
  active: boolean;
  onSelect: () => void;
};

export function WorldIsland({ config, active, onSelect }: Props) {
  const Diorama = ROOM_DIORAMAS[config.id];

  return (
    <RoomShell config={config} active={active} onSelect={onSelect}>
      <Diorama active={active} accent={config.color} />
    </RoomShell>
  );
}
