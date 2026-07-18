"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";
import { useWorldStore } from "@/stores/world-store";
import { resolveCvSection } from "@/world/path-to-room";
import { CvScrollSnapEnhancer } from "./CvScrollSnapEnhancer";
import { WorldMobilePaintBg } from "@/components/world/WorldMobilePaintBg";

type Props = { children: ReactNode };

/** Scroll com snap entre secções (modo 3D) + sync hash ↔ câmara. */
export function WorldCvScrollRoot({ children }: Props) {
  const enabled = useWorldEnabled();

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("world-cv-scroll");
    } else {
      root.classList.remove("world-cv-scroll");
    }
    return () => root.classList.remove("world-cv-scroll");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const syncFromHash = () => {
      const section = resolveCvSection(window.location.pathname, window.location.hash);
      useWorldStore.getState().setFocusRoom(section);
    };

    if (!window.location.hash) {
      useWorldStore.setState({ focusRoomId: "profile", phase: "idle", cameraMode: "scroll" });
    } else {
      syncFromHash();
    }

    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [enabled]);

  return (
    <div
      className={
        enabled
          ? "cv-world-document flex min-h-0 flex-1 flex-col"
          : "flex min-h-0 flex-1 flex-col"
      }
    >
      {enabled ? <CvScrollSnapEnhancer /> : null}
      {enabled ? <WorldMobilePaintBg /> : null}
      {children}
    </div>
  );
}
