"use client";

import type { ReactNode } from "react";
import { WorldShell } from "./WorldShell";

/** @deprecated Use {@link WorldShell} no layout raiz + {@link WorldIntlSync} no layout locale. */
export function WorldProvider({ children }: { children: ReactNode }) {
  return <WorldShell>{children}</WorldShell>;
}
