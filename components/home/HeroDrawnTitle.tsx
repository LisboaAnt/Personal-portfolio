"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { useLocale } from "next-intl";
import { isHeroDrawTitle } from "@/lib/hero-enter";
import {
  buildTitleLayout,
  getHeroHeadlineFontSizePx,
  HERO_HEADLINE_FONT_URL,
  loadHeroTitleFont,
  type TitleLayout,
} from "@/lib/hero-title-paths";

const DRAW_S = 0.75;
const STAGGER_S = 0.055;
const FILL_AFTER_STROKE_S = 0.1;

type Props = {
  text: string;
  className?: string;
  fallbackClassName?: string;
  fontUrl?: string;
  getFontSizePx?: () => number;
};

export function HeroDrawnTitle({
  text,
  className = "",
  fallbackClassName = "hero-headline",
  fontUrl = HERO_HEADLINE_FONT_URL,
  getFontSizePx = getHeroHeadlineFontSizePx,
}: Props) {
  const locale = useLocale();
  const reduced = useReducedMotion();
  const drawTitle = isHeroDrawTitle();
  const gradientId = useId().replace(/:/g, "");
  const [layout, setLayout] = useState<TitleLayout | null>(null);
  const [status, setStatus] = useState<"loading" | "draw" | "static" | "error">("loading");
  const [reservedHeight, setReservedHeight] = useState<number | null>(null);

  useEffect(() => {
    void loadHeroTitleFont(fontUrl);
    setReservedHeight(getFontSizePx() * 1.12);
  }, [fontUrl, getFontSizePx]);

  useEffect(() => {
    let cancelled = false;

    const build = async () => {
      const fontSize = getFontSizePx();
      if (fontSize < 8) return;

      try {
        const font = await loadHeroTitleFont(fontUrl);
        if (cancelled) return;

        const next = buildTitleLayout(text, font, fontSize);
        if (!next) {
          setStatus("error");
          setLayout(null);
          return;
        }

        setLayout(next);
        setReservedHeight(next.height);
        setStatus(reduced || !drawTitle ? "static" : "draw");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setLayout(null);
        }
      }
    };

    void build();

    const onResize = () => {
      setStatus("loading");
      setLayout(null);
      setReservedHeight(getFontSizePx() * 1.12);
      void build();
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [drawTitle, fontUrl, getFontSizePx, reduced, text]);

  const strokeW = layout ? Math.max(1.5, layout.height * 0.035) : 2;
  const isDraw = status === "draw" && layout;
  const isStatic = (status === "static" || status === "error") && layout;
  const showSvg = layout && (isDraw || isStatic);
  const showFallback = status === "error" && !layout;

  return (
    <div className={`hero-title-font relative w-full max-w-full ${className}`}>
      <div
        className="relative w-full"
        style={{ minHeight: reservedHeight ?? "1.12em" }}
        suppressHydrationWarning
      >
        <h1 className="sr-only" lang={locale}>
          {text}
        </h1>

        {showFallback ? (
          <p className={`block ${fallbackClassName}`} aria-hidden>
            {text}
          </p>
        ) : null}

        {showSvg ? (
          <svg
            className="block h-auto w-auto max-w-full overflow-visible"
            width={layout.width-0.1}
            height={layout.height}
            viewBox={layout.viewBox}
            preserveAspectRatio="xMinYMid meet"
            aria-hidden
          >
            <defs>
              <linearGradient id={`${gradientId}-fill`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--foreground)" />
                <stop offset="100%" stopColor="var(--foreground)" />
              </linearGradient>
              <linearGradient id={`${gradientId}-stroke`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--foreground)" />
                <stop offset="50%" stopColor="var(--foreground)" />
                <stop offset="100%" stopColor="var(--foreground)" />
              </linearGradient>
            </defs>

            <g transform={layout.transform}>
              {layout.glyphs.map((glyph, i) => {
                const delay = 0.12 + i * STAGGER_S;
                const fillDelay = delay + DRAW_S + FILL_AFTER_STROKE_S;

                if (isStatic) {
                  return (
                    <path
                      key={glyph.id}
                      d={glyph.d}
                      fill={`url(#${gradientId}-fill)`}
                    />
                  );
                }

                return (
                  <g key={glyph.id}>
                    <path
                      d={glyph.d}
                      fill="none"
                      stroke={`url(#${gradientId}-stroke)`}
                      strokeWidth={strokeW}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="hero-title-stroke"
                      style={
                        {
                          "--path-len": glyph.length,
                          "--draw-delay": `${delay}s`,
                          "--draw-dur": `${DRAW_S}s`,
                        } as React.CSSProperties
                      }
                    />
                    <path
                      d={glyph.d}
                      fill={`url(#${gradientId}-fill)`}
                      stroke="none"
                      className="hero-title-fill"
                      style={
                        {
                          "--fill-delay": `${fillDelay}s`,
                        } as React.CSSProperties
                      }
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        ) : null}
      </div>
    </div>
  );
}
