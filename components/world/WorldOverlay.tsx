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

const MOBILE_MQ = "(max-width: 639px)";

function subscribeReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeMobile(cb: () => void) {
  const mq = window.matchMedia(MOBILE_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getIsMobile() {
  return window.matchMedia(MOBILE_MQ).matches;
}

export function WorldOverlay({ children }: Props) {
  const blenderScene = isBlenderWorldScene();
  const phase = useWorldStore((s) => s.phase);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const isMobile = useSyncExternalStore(subscribeMobile, getIsMobile, () => false);

  // Mobile sem 3D: não esbater o conteúdo (nav / scroll hint).
  const fadeForTravel = phase === "traveling" && !reducedMotion && !isMobile;
  const opacity = fadeForTravel ? 0.15 : 1;
  const pointerEvents =
    phase === "traveling" && !isMobile ? "none" : blenderScene ? "none" : "auto";
  const fadeMs =
    reducedMotion || isMobile
      ? 0
      : phase === "traveling"
        ? WORLD_OVERLAY_FADE_OUT_MS
        : WORLD_OVERLAY_FADE_IN_MS;

  return (
    <div
      className={`world-overlay relative z-10 flex min-h-0 flex-1 flex-col transition-opacity ease-out ${blenderScene ? "world-overlay--orbit pointer-events-none" : ""}`}
      style={{
        opacity,
        transitionDuration: `${fadeMs}ms`,
        pointerEvents,
      }}
      aria-busy={phase === "traveling" && !isMobile}
    >
      <div
        className={
          blenderScene
            ? "pointer-events-auto flex min-h-0 flex-1 flex-col"
            : "flex min-h-0 flex-1 flex-col"
        }
      >
        {children}
      </div>
    </div>
  );
}
