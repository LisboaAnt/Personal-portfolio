"use client";

import { useEffect, useRef } from "react";
import { useWorldStore } from "@/stores/world-store";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";

/** Após viagem por link, move o foco para o título principal da página. */
export function WorldFocusManager() {
  const enabled = useWorldEnabled();
  const phase = useWorldStore((s) => s.phase);
  const prevPhase = useRef(phase);

  useEffect(() => {
    if (!enabled) return;

    const wasTraveling = prevPhase.current === "traveling";
    prevPhase.current = phase;

    if (!wasTraveling || phase !== "idle") return;

    const timer = window.setTimeout(() => {
      const heading =
        document.querySelector<HTMLElement>("main h1") ??
        document.querySelector<HTMLElement>(".flow-page h1") ??
        document.querySelector<HTMLElement>("h1");

      if (!heading) return;
      if (!heading.hasAttribute("tabindex")) {
        heading.setAttribute("tabindex", "-1");
      }
      heading.focus({ preventScroll: true });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [enabled, phase]);

  return null;
}
