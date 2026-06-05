"use client";

import type { ReactNode } from "react";
import { useWorldEnabled } from "@/hooks/useWorldEnabled";

type Props = { children: ReactNode };

/** Esconde o footer global quando o CV scrollável (mundo 3D) está activo. */
export function SiteChromeFooterGate({ children }: Props) {
  const worldEnabled = useWorldEnabled();
  if (worldEnabled) return null;
  return children;
}
