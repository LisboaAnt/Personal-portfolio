"use client";

import { isWorldCameraCoordsHudEnabled } from "@/world/world-camera-hud";
import { isBlenderWorldScene } from "@/world/world-scene-mode";
import { WorldAnnouncer } from "./WorldAnnouncer";
import { WorldCameraCoordsHud } from "./WorldCameraCoordsHud";
import { WorldCvSectionChromeSync } from "./WorldCvSectionChromeSync";
import { WorldBackgroundViewToggleGate } from "./WorldBackgroundViewToggleGate";
import { WorldNavSync } from "./WorldNavSync";
import { WorldScrollSync } from "./WorldScrollSync";

import { usePathname } from "@/i18n/navigation";
import { normalizePathname } from "@/world/path-to-room";

/** Requer `NextIntlClientProvider` — vive em `app/[locale]/layout.tsx`. */
export function WorldIntlSync() {
  const pathname = usePathname();
  const isSpikeDemo = normalizePathname(pathname) === "/lab/world";
  const showBlenderHud =
    !isSpikeDemo && isBlenderWorldScene() && isWorldCameraCoordsHudEnabled();

  return (
    <>
      <WorldAnnouncer />
      <WorldNavSync />
      <WorldScrollSync />
      <WorldCvSectionChromeSync />
      <WorldBackgroundViewToggleGate />
      {showBlenderHud ? <WorldCameraCoordsHud /> : null}
    </>
  );
}
