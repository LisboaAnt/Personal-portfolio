"use client";

import { useEffect, useState } from "react";

/** Pausa animações 3D quando o separador está oculto ou o utilizador prefere menos movimento. */
export function useAnimationPaused(): boolean {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const sync = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setPaused(document.hidden || reduced);
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", sync);

    return () => {
      document.removeEventListener("visibilitychange", sync);
      mq.removeEventListener("change", sync);
    };
  }, []);

  return paused;
}
