import type { ReactNode } from "react";
import { DM_Sans, MedievalSharp } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WorldShell } from "@/components/world/WorldShell";
import { isWorldWallpaperEnabled, WORLD_WALLPAPER_HTML_CLASS, WORLD_WALLPAPER_URL } from "@/world/world-wallpaper";
import "./globals.css";

const wallpaperHead = isWorldWallpaperEnabled() ? (
  <link rel="preload" href={WORLD_WALLPAPER_URL} as="image" type="image/png" fetchPriority="high" />
) : null;

const heroFontPreload = (
  <link
    rel="preload"
    href="/fonts/MedievalSharp-Regular.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
  />
);

const googleFontsPreconnect = (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap"
      rel="stylesheet"
    />
  </>
);

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

const medievalSharp = MedievalSharp({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hero-serif",
  display: "swap",
});

/**
 * Shell estável (tema + mundo 3D) — não remonta ao trocar `[locale]`.
 * `lang` é sincronizado em `DocumentLang` dentro de `app/[locale]/layout.tsx`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark${isWorldWallpaperEnabled() ? ` ${WORLD_WALLPAPER_HTML_CLASS}` : ""}`}
      suppressHydrationWarning
    >
      <head>
        {googleFontsPreconnect}
        {heroFontPreload}
        {wallpaperHead}
      </head>
      <body
        suppressHydrationWarning
        className={`${dmSans.className} ${dmSans.variable} ${medievalSharp.variable} min-h-screen bg-[var(--surface)] text-[var(--foreground)] antialiased`}
      >
        <ThemeProvider>
          <WorldShell>{children}</WorldShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
