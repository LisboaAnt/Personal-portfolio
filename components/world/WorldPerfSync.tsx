"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useWorldPerfStore } from "@/stores/world-perf-store";

const SAMPLE_MS = 400;

/** Atualiza FPS e contadores WebGL para o HUD da câmara. */
export function WorldPerfSync() {
  const { gl } = useThree();
  const setPerf = useWorldPerfStore((s) => s.setPerf);
  const reset = useWorldPerfStore((s) => s.reset);

  const frames = useRef(0);
  const frameMsSum = useRef(0);
  const lastSample = useRef(performance.now());
  const lastFrame = useRef(performance.now());

  useEffect(() => () => reset(), [reset]);

  useFrame(() => {
    const now = performance.now();
    const delta = now - lastFrame.current;
    lastFrame.current = now;
    frames.current += 1;
    frameMsSum.current += delta;

    if (now - lastSample.current < SAMPLE_MS) return;

    const elapsed = now - lastSample.current;
    const count = frames.current;
    const fps = Math.round((count * 1000) / elapsed);
    const avgFrameMs = count > 0 ? frameMsSum.current / count : 0;
    frames.current = 0;
    frameMsSum.current = 0;
    lastSample.current = now;

    const render = gl.info.render;
    const memory = gl.info.memory;

    setPerf({
      fps,
      frameMs: avgFrameMs,
      triangles: render.triangles,
      drawCalls: render.calls,
      geometries: memory.geometries,
      textures: memory.textures,
    });
  });

  return null;
}
