"use client";

import { useEffect, useState } from "react";
import { detectWebGLOnClient } from "@/world/world-3d-client";

export function useWebGLAvailable(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(() =>
    typeof window === "undefined" ? null : detectWebGLOnClient(),
  );

  useEffect(() => {
    setOk(detectWebGLOnClient());
  }, []);

  return ok;
}
