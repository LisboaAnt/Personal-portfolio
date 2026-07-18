"use client";

import { useCallback, useEffect, useState } from "react";
import {
  WORLD_PREFERENCE_EVENT,
  isWorld3DCanvasBlockedOnMobile,
  resolveWorld3DRequested,
} from "@/world/world-preference";
import {
  resolveWorldCanvasEnabledOnClient,
  resolveWorldEnabledInitial,
  resolveWorldEnabledOnClient,
} from "@/world/world-3d-client";

export function useWorldEnabled(): boolean {
  const [enabled, setEnabled] = useState(resolveWorldEnabledInitial);

  const sync = useCallback(() => {
    setEnabled(resolveWorldEnabledOnClient());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(WORLD_PREFERENCE_EVENT, sync);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener(WORLD_PREFERENCE_EVENT, sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  return enabled;
}

/** Canvas 3D / GLB — false no mobile (exceto opt-in). */
export function useWorldCanvasEnabled(): boolean {
  const [enabled, setEnabled] = useState(false);

  const sync = useCallback(() => {
    setEnabled(resolveWorldCanvasEnabledOnClient());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener(WORLD_PREFERENCE_EVENT, sync);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener(WORLD_PREFERENCE_EVENT, sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  return enabled;
}

export function useWorldMobileBlocked(): boolean {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const update = () => {
      setBlocked(resolveWorld3DRequested() && isWorld3DCanvasBlockedOnMobile());
    };
    update();
    window.addEventListener(WORLD_PREFERENCE_EVENT, update);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener(WORLD_PREFERENCE_EVENT, update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return blocked;
}
