"use client";

import { useEffect, useState } from "react";
import {
  isGlbAnimationBlockedOnMobile,
  isGlbAnimationEnvEnabled,
} from "@/world/glb-animations";

export function useGlbAnimationsEnabled(): boolean {
  const [enabled, setEnabled] = useState(isGlbAnimationEnvEnabled);

  useEffect(() => {
    const sync = () => {
      setEnabled(isGlbAnimationEnvEnabled() && !isGlbAnimationBlockedOnMobile());
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return enabled;
}
