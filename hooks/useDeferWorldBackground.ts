import { useEffect, useState } from "react";
import { WORLD_BACKGROUND_DELAY_MS } from "@/world/world-wallpaper";

/**
 * Adia a montagem do canvas WebGL (o wallpaper.png e o preload do GLB começam antes).
 */
export function useDeferWorldBackground(enabled: boolean): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }

    const t = window.setTimeout(() => setReady(true), WORLD_BACKGROUND_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [enabled]);

  return ready;
}
