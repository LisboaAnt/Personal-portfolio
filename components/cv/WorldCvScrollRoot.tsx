"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";
import { useWorldStore } from "@/stores/world-store";
import { resolveCvSection } from "@/world/path-to-room";

type Props = { children: ReactNode };

/** Scroll-snap do CV + sincronização hash ↔ câmara 3D. */
export function WorldCvScrollRoot({ children }: Props) {
  const enabled = useWorldEnabled();

  useEffect(() => {
    if (!enabled) return;

    const syncFromHash = () => {
      const section = resolveCvSection(window.location.pathname, window.location.hash);
      useWorldStore.getState().setFocusRoom(section);
    };

    if (!window.location.hash) {
      useWorldStore.setState({ focusRoomId: "profile", phase: "idle", cameraMode: "scroll" });
      requestAnimationFrame(() => {
        document.getElementById("profile")?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    } else {
      syncFromHash();
    }

    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [enabled]);

  return (
    <div className={enabled ? "cv-world-document" : undefined}>{children}</div>
  );
}
