"use client";

import type { ReactNode } from "react";
import { WorldLink } from "./WorldLink";

type Props = {
  children: ReactNode;
  className?: string;
};

export function WorldBrandLink({ children, className }: Props) {
  return (
    <WorldLink href="/" className={className} prefetch>
      {children}
    </WorldLink>
  );
}
