"use client";

import { useEffect, useState } from "react";

export function useWebGLAvailable(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
        canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
      setOk(Boolean(gl));
    } catch {
      setOk(false);
    }
  }, []);

  return ok;
}
