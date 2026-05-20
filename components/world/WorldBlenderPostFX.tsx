"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useWorldQuality } from "@/hooks/useWorldQuality";
import { getBlenderLightingFromEnv } from "@/world/blender-lighting-env";

/** Pós-processo estilo Sketchfab: cena escura + bloom em luzes brilhantes. */
export function WorldBlenderPostFX() {
  const quality = useWorldQuality();
  const light = getBlenderLightingFromEnv();

  if (!light.postFxEnabled || quality === "low") return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={light.bloomIntensity}
        luminanceThreshold={light.bloomThreshold}
        luminanceSmoothing={0.82}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.28} darkness={light.vignetteDarkness} />
    </EffectComposer>
  );
}
