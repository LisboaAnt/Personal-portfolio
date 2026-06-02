"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname as useNextPathname } from "next/navigation";
import { useWebGLAvailable } from "@/hooks/useWebGLAvailable";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";
import { normalizePathname } from "@/world/path-to-room";
import { isBlenderWorldScene } from "@/world/world-scene-mode";
import { WorldGlbPreload } from "./WorldGlbPreload";
import { WorldShiftMouseMode } from "./WorldShiftMouseMode";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import { WorldCanvas } from "./WorldCanvas";
import { WorldFocusManager } from "./WorldFocusManager";
import { WorldPosterCaptureButton } from "./WorldPosterCaptureButton";
import { isWorldPosterCaptureEnabled } from "@/world/world-poster-capture";
import {
  isWorldWallpaperEnabled,
  WORLD_WALLPAPER_HTML_CLASS,
} from "@/world/world-wallpaper";
import { useDeferWorldBackground } from "@/hooks/useDeferWorldBackground";
import { useWorldPosterStore } from "@/stores/world-poster-store";

type Props = { children: ReactNode };

/**
 * Canvas + wallpaper no layout raiz (sem next-intl).
 * Sync com traduções em {@link WorldIntlSync} dentro de `[locale]/layout`.
 */
export function WorldShell({ children }: Props) {
  const [mounted, setMounted] = useState(false);
  const enabled = useWorldEnabled();
  const webgl = useWebGLAvailable();
  const pathname = normalizePathname(useNextPathname());
  const sceneReady = useWorldPosterStore((s) => s.sceneReady);
  const isSpikeDemo = pathname === "/lab/world";
  const wallpaperFlow = isWorldWallpaperEnabled();
  const worldReady = enabled && webgl === true;
  const wallpaperOn = wallpaperFlow && enabled && !isSpikeDemo;
  const deferCanvas = useDeferWorldBackground(wallpaperOn && mounted);
  const mountWorldCanvas = worldReady && !isSpikeDemo && (!wallpaperFlow || deferCanvas);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    useWorldPosterStore.getState().reset();
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (wallpaperOn) {
      root.classList.add(WORLD_WALLPAPER_HTML_CLASS);
    } else {
      root.classList.remove(WORLD_WALLPAPER_HTML_CLASS, "world-wallpaper-fade");
    }
  }, [wallpaperOn]);

  useEffect(() => {
    const root = document.documentElement;
    if (sceneReady && wallpaperOn) {
      root.classList.add("world-wallpaper-fade");
    } else {
      root.classList.remove("world-wallpaper-fade");
    }
  }, [sceneReady, wallpaperOn]);

  useEffect(() => {
    if (!mounted) return;
    const show3dChrome =
      enabled && webgl && (wallpaperFlow ? deferCanvas && sceneReady : deferCanvas || !wallpaperFlow);
    if (show3dChrome) {
      document.documentElement.classList.add("world-3d-active");
    } else {
      document.documentElement.classList.remove("world-3d-active");
    }
    return () => document.documentElement.classList.remove("world-3d-active");
  }, [deferCanvas, enabled, mounted, sceneReady, wallpaperFlow, webgl]);

  if (!mounted) {
    return <>{children}</>;
  }

  if (enabled === false) {
    return <>{children}</>;
  }

  if (webgl === false) {
    return <>{children}</>;
  }

  return (
    <>
      {isBlenderWorldScene() && (!wallpaperFlow || deferCanvas) ? <WorldGlbPreload /> : null}
      <WebGLErrorBoundary fallback={children}>
        {mountWorldCanvas ? <WorldCanvas className="fixed inset-0 z-0" scene="site" /> : null}
        {!isSpikeDemo && isBlenderWorldScene() ? <WorldShiftMouseMode /> : null}
        <WorldFocusManager />
        {worldReady && !isSpikeDemo && isBlenderWorldScene() && isWorldPosterCaptureEnabled() ? (
          <WorldPosterCaptureButton />
        ) : null}
        {children}
      </WebGLErrorBoundary>
    </>
  );
}
