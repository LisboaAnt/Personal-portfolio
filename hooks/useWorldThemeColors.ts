"use client";

import { useEffect, useState } from "react";
import { getWorldThemeColors, type WorldThemeColors } from "@/world/theme-colors";

export function useWorldThemeColors(): WorldThemeColors {
  const [colors, setColors] = useState<WorldThemeColors>(() => getWorldThemeColors());

  useEffect(() => {
    const update = () => setColors(getWorldThemeColors());

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return colors;
}
