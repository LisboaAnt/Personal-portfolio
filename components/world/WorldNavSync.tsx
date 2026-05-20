"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { useWorldStore } from "@/stores/world-store";
import { resolveCvSection } from "@/world/path-to-room";

/** Sincroniza pathname/hash → secção CV (voltar/avançar). */
export function WorldNavSync() {
  const pathname = usePathname();
  const mounted = useRef(false);

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const sectionId = resolveCvSection(pathname, hash);
    const state = useWorldStore.getState();

    if (!mounted.current) {
      mounted.current = true;
      useWorldStore.setState({ focusRoomId: sectionId, phase: "idle", cameraMode: "scroll" });
      return;
    }

    if (sectionId === state.focusRoomId) return;
    if (state.phase === "traveling") return;

    useWorldStore.getState().setFocusRoom(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pathname]);

  useEffect(() => {
    const onHash = () => {
      const sectionId = resolveCvSection(pathname, window.location.hash);
      useWorldStore.getState().setFocusRoom(sectionId);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [pathname]);

  return null;
}
