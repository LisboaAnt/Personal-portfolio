import { create } from "zustand";
import type { WorldQuality } from "@/hooks/useWorldQuality";

export type WorldPerfSnapshot = {
  fps: number;
  frameMs: number;
  triangles: number;
  drawCalls: number;
  geometries: number;
  textures: number;
};

type WorldPerfState = WorldPerfSnapshot & {
  setPerf: (data: Partial<WorldPerfSnapshot>) => void;
  reset: () => void;
};

const INITIAL: WorldPerfSnapshot = {
  fps: 0,
  frameMs: 0,
  triangles: 0,
  drawCalls: 0,
  geometries: 0,
  textures: 0,
};

export const useWorldPerfStore = create<WorldPerfState>((set) => ({
  ...INITIAL,
  setPerf: (data) => set((s) => ({ ...s, ...data })),
  reset: () => set(INITIAL),
}));

export const WORLD_TRIANGLE_BUDGET = 15_000;

export function perfStatus(fps: number): "ok" | "warn" | "bad" {
  if (fps >= 40) return "ok";
  if (fps >= 28) return "warn";
  return "bad";
}

export function triangleStatus(triangles: number): "ok" | "warn" | "bad" {
  if (triangles <= WORLD_TRIANGLE_BUDGET) return "ok";
  if (triangles <= WORLD_TRIANGLE_BUDGET * 4) return "warn";
  return "bad";
}

export function qualityLabel(quality: WorldQuality): string {
  return quality === "high" ? "alto" : "baixo";
}
