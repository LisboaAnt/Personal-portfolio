"use client";

import { usePathname } from "@/i18n/navigation";
import { useWebGLAvailable } from "@/hooks/useWebGLAvailable";
import { useWorldCanvasEnabled, useWorldEnabled } from "@/hooks/useWorldEnabled";
import { normalizePathname } from "@/world/path-to-room";
import { isBlenderWorldScene } from "@/world/world-scene-mode";
import { WorldBackgroundViewToggle } from "./WorldBackgroundViewToggle";

/** Só dentro de `NextIntlClientProvider` — ver {@link WorldIntlSync}. */
export function WorldBackgroundViewToggleGate() {
  const enabled = useWorldEnabled();
  const canvasEnabled = useWorldCanvasEnabled();
  const webgl = useWebGLAvailable();
  const pathname = normalizePathname(usePathname());
  const isSpikeDemo = pathname === "/lab/world";

  if (!enabled || !canvasEnabled || webgl !== true || isSpikeDemo || !isBlenderWorldScene()) {
    return null;
  }

  return <WorldBackgroundViewToggle />;
}
