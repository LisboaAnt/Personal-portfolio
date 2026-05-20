import type { SpikeIslandConfig } from "./types";

/** Ilhas do spike Fase 1 — alinhadas às salas futuras. */
export const SPIKE_ISLANDS: SpikeIslandConfig[] = [
  {
    id: "home",
    label: "Home",
    color: "#6366f1",
    position: [-4, 0.6, 0],
    camera: {
      position: [-4, 2.5, 7],
      target: [-4, 0.5, 0],
      fov: 42,
    },
  },
  {
    id: "work",
    label: "Work",
    color: "#818cf8",
    position: [0, 0.6, 0],
    camera: {
      position: [0, 2.8, 6],
      target: [0, 0.5, 0],
      fov: 38,
    },
  },
  {
    id: "lab",
    label: "Lab",
    color: "#a78bfa",
    position: [4, 0.6, 0],
    camera: {
      position: [4, 2.5, 7],
      target: [4, 0.5, 0],
      fov: 42,
    },
  },
];

export const SPIKE_DEFAULT_CAMERA: SpikeIslandConfig["camera"] = {
  position: [0, 5, 14],
  target: [0, 0, 0],
  fov: 45,
};
