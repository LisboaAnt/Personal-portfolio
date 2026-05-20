"use client";

import type { MeshToonMaterialParameters } from "three";
import { getToonGradientMap } from "@/world/toon-gradient";

type Props = {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
} & Pick<MeshToonMaterialParameters, "transparent" | "opacity">;

export function WorldMaterial({
  color,
  emissive,
  emissiveIntensity = 0,
  transparent,
  opacity,
}: Props) {
  return (
    <meshToonMaterial
      color={color}
      gradientMap={getToonGradientMap()}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissiveIntensity}
      transparent={transparent}
      opacity={opacity}
    />
  );
}
