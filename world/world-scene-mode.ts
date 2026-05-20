export type WorldSceneSource = "code" | "blender";

export function getWorldSceneSource(): WorldSceneSource {
  if (process.env.NEXT_PUBLIC_WORLD_SCENE === "code") return "code";
  return "blender";
}

export function isBlenderWorldScene(): boolean {
  return getWorldSceneSource() === "blender";
}
