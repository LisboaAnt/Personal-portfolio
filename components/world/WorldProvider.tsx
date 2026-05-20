"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useWebGLAvailable } from "@/hooks/useWebGLAvailable";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";
import { normalizePathname } from "@/world/path-to-room";
import { isBlenderWorldScene } from "@/world/world-scene-mode";
import { WorldCameraCoordsHud } from "./WorldCameraCoordsHud";
import { WorldShiftMouseMode } from "./WorldShiftMouseMode";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import { WorldAnnouncer } from "./WorldAnnouncer";
import { WorldFocusManager } from "./WorldFocusManager";
import { WorldNavSync } from "./WorldNavSync";
import { WorldScrollSync } from "./WorldScrollSync";

const WorldCanvas = dynamic(
  () => import("./WorldCanvas").then((m) => m.WorldCanvas),
  { ssr: false, loading: () => null }
);

type Props = { children: ReactNode };

export function WorldProvider({ children }: Props) {
  const enabled = useWorldEnabled();
  const webgl = useWebGLAvailable();
  const pathname = usePathname();
  const isSpikeDemo = normalizePathname(pathname) === "/lab/world";
  const showCameraHud = !isSpikeDemo && isBlenderWorldScene();

  useEffect(() => {
    if (enabled && webgl) {
      document.documentElement.classList.add("world-3d-active");
    } else {
      document.documentElement.classList.remove("world-3d-active");
    }
    return () => document.documentElement.classList.remove("world-3d-active");
  }, [enabled, webgl]);

  if (!enabled || webgl === false) {
    return <>{children}</>;
  }

  if (webgl === null) {
    return <>{children}</>;
  }

  return (
    <>
      <WebGLErrorBoundary fallback={children}>
        {!isSpikeDemo && <WorldCanvas className="fixed inset-0 z-0" scene="site" />}
        {showCameraHud ? (
          <>
            <WorldShiftMouseMode />
            <WorldCameraCoordsHud />
          </>
        ) : null}
        <WorldAnnouncer />
        <WorldFocusManager />
        <WorldNavSync />
        <WorldScrollSync />
        {children}
      </WebGLErrorBoundary>
    </>
  );
}
