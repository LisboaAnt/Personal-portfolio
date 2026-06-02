"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = { children: React.ReactNode };

/** Só no /lab — demo next-themes (script fica fora do layout raiz). */
export function LabThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
