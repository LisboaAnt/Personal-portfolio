"use client";

import { useEffect, useState } from "react";

export type WorldQuality = "low" | "high";

export function useWorldQuality(): WorldQuality {
  const [quality, setQuality] = useState<WorldQuality>("high");

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowMem = typeof mem === "number" && mem < 4;
    setQuality(narrow || coarse || lowMem ? "low" : "high");
  }, []);

  return quality;
}
