import type { CameraPose, RoomId } from "./types";

export type RoomConfig = {
  id: RoomId;
  label: string;
  color: string;
  /** Posição do centro da ilha [x, y, z] */
  position: [number, number, number];
  camera: CameraPose;
  /** Rotas sem locale (pathname normalizado) */
  paths: string[];
};

export const WORLD_OVERVIEW_CAMERA: CameraPose = {
  position: [0, 6, 15],
  target: [0, 0, 0],
  fov: 46,
};

export const WORLD_ROOMS: RoomConfig[] = [
  {
    id: "home",
    label: "Home",
    color: "#6366f1",
    position: [-5, 0.65, 0],
    paths: ["/", ""],
    camera: {
      position: [-5, 2.6, 7],
      target: [-5, 0.5, 0],
      fov: 42,
    },
  },
  {
    id: "work",
    label: "Work",
    color: "#818cf8",
    position: [-1.5, 0.65, 0],
    paths: ["/work"],
    camera: {
      position: [-1.5, 2.9, 6.2],
      target: [-1.5, 0.5, 0],
      fov: 38,
    },
  },
  {
    id: "flow",
    label: "Flow",
    color: "#22d3ee",
    position: [1.5, 0.65, 0],
    paths: ["/flow"],
    camera: {
      position: [1.5, 2.7, 6.5],
      target: [1.5, 0.5, 0],
      fov: 40,
    },
  },
  {
    id: "lab",
    label: "Lab",
    color: "#a78bfa",
    position: [5, 0.65, 0],
    paths: ["/lab", "/lab/world"],
    camera: {
      position: [5, 2.6, 7],
      target: [5, 0.5, 0],
      fov: 42,
    },
  },
];

export function getRoomById(id: RoomId): RoomConfig {
  const room = WORLD_ROOMS.find((r) => r.id === id);
  if (!room) throw new Error(`Unknown room: ${id}`);
  return room;
}

export function getRoomCamera(id: RoomId): CameraPose {
  return getRoomById(id).camera;
}
