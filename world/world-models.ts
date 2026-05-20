/** Quais GLBs carregar no modo `NEXT_PUBLIC_WORLD_SCENE=blender`. */

export type WorldGlbModel = "blender" | "sketch";

function parseModelsRaw(): string {
  const models = process.env.NEXT_PUBLIC_WORLD_MODELS?.trim();
  if (models) return models.toLowerCase();
  return "blender";
}

export function getWorldGlbModels(): WorldGlbModel[] {
  const raw = parseModelsRaw();
  const tokens = raw === "both" ? ["blender", "sketch"] : raw.split(/[,+\s]+/);

  const out: WorldGlbModel[] = [];
  for (const t of tokens) {
    if (t === "blender" || t === "sketch") out.push(t);
  }

  return out.length > 0 ? out : ["blender"];
}

export function hasWorldGlbModel(model: WorldGlbModel): boolean {
  return getWorldGlbModels().includes(model);
}

export function isSketchOnlyMode(): boolean {
  return hasWorldGlbModel("sketch") && !hasWorldGlbModel("blender");
}
