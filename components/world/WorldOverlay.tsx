"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { isBlenderWorldScene } from "@/world/world-scene-mode";
import { useWorldStore } from "@/stores/world-store";
import {
  WORLD_OVERLAY_FADE_IN_MS,
  WORLD_OVERLAY_FADE_OUT_MS,
} from "@/world/constants";

type Props = { children: ReactNode };

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function WorldOverlay({ children }: Props) {
  const blenderScene = isBlenderWorldScene();
  const phase = useWorldStore((s) => s.phase);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  const opacity = phase === "traveling" && !reducedMotion ? 0.15 : 1;
  const pointerEvents =
    phase === "traveling" ? "none" : blenderScene ? "none" : "auto";
  const fadeMs = reducedMotion
    ? 0
    : phase === "traveling"
      ? WORLD_OVERLAY_FADE_OUT_MS
      : WORLD_OVERLAY_FADE_IN_MS;

  return (
    <div
      className={`world-overlay relative z-10 min-h-[calc(100dvh-8rem)] transition-opacity ease-out ${blenderScene ? "world-overlay--orbit pointer-events-none" : ""}`}
      style={{
        opacity,
        transitionDuration: `${fadeMs}ms`,
        pointerEvents,
      }}
      aria-busy={phase === "traveling"}
    >
      <div className={blenderScene ? "pointer-events-auto" : undefined}>{children}</div>
    </div>
  );
}
