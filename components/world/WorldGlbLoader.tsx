"use client";

import { Loader } from "@react-three/drei";

export function WorldGlbLoader() {
  return (
    <Loader
      containerStyles={{ background: "transparent", pointerEvents: "none", zIndex: 15 }}
      barStyles={{ background: "var(--accent)", height: 3 }}
      dataInterpolation={(p) => `${p.toFixed(0)}%`}
    />
  );
}
