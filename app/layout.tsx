import type { ReactNode } from "react";

/**
 * Layout raiz mínimo — `<html>` / `<body>` ficam em `app/[locale]/layout.tsx`
 * (requisito do next-intl para `lang` dinâmico).
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
