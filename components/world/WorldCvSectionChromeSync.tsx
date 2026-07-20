"use client";

import { useEffect } from "react";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";
import { useWorldStore } from "@/stores/world-store";

/** Expõe a secção CV activa em `html[data-cv-section]` (estilos da navbar, etc.). */
export function WorldCvSectionChromeSync() {
  const enabled = useWorldEnabled();
  const focusRoomId = useWorldStore((s) => s.focusRoomId);

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      delete root.dataset.cvSection;
      return;
    }
    root.dataset.cvSection = focusRoomId;
    return () => {
      delete root.dataset.cvSection;
    };
  }, [enabled, focusRoomId]);

  return null;
}
