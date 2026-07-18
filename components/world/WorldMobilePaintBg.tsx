"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { isWorldWallpaperEnabled } from "@/world/world-wallpaper";
import { isMobileViewport } from "@/world/world-preference";

/**
 * Pintura no fundo do conteúdo mobile — acompanha o scroll (não fica colada ao ecrã).
 * Portal para `.cv-page-flow` para cobrir toda a altura do documento.
 */
export function WorldMobilePaintBg() {
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const sync = () => {
      if (!isWorldWallpaperEnabled() || !isMobileViewport()) {
        setHost(null);
        return;
      }
      setHost(document.querySelector<HTMLElement>(".cv-page-flow"));
    };

    sync();
    const timer = window.setInterval(sync, 500);
    window.addEventListener("resize", sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("resize", sync);
    };
  }, []);

  if (!host) return null;

  return createPortal(
    <div className="world-mobile-paint-bg" aria-hidden>
      <span className="world-mobile-paint-bg__orb world-mobile-paint-bg__orb--a" />
      <span className="world-mobile-paint-bg__orb world-mobile-paint-bg__orb--b" />
      <span className="world-mobile-paint-bg__orb world-mobile-paint-bg__orb--c" />
      <span className="world-mobile-paint-bg__orb world-mobile-paint-bg__orb--d" />
      <span className="world-mobile-paint-bg__orb world-mobile-paint-bg__orb--e" />
      <span className="world-mobile-paint-bg__orb world-mobile-paint-bg__orb--f" />
      <span className="world-mobile-paint-bg__ring world-mobile-paint-bg__ring--a" />
      <span className="world-mobile-paint-bg__ring world-mobile-paint-bg__ring--b" />
      <span className="world-mobile-paint-bg__ring world-mobile-paint-bg__ring--c" />
      <span className="world-mobile-paint-bg__ring world-mobile-paint-bg__ring--d" />
      <span className="world-mobile-paint-bg__stroke world-mobile-paint-bg__stroke--a" />
      <span className="world-mobile-paint-bg__stroke world-mobile-paint-bg__stroke--b" />
      <span className="world-mobile-paint-bg__stroke world-mobile-paint-bg__stroke--c" />
      <span className="world-mobile-paint-bg__stroke world-mobile-paint-bg__stroke--d" />
    </div>,
    host,
  );
}
