"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { isHeroDrawTitle } from "@/lib/hero-enter";
import {
  buildTitleLayout,
  getHeroHeadlineFontSizePx,
  HERO_HEADLINE_FONT_URL,
  loadHeroTitleFont,
  peekTitleLayout,
  type TitleLayout,
  type TitleLayoutPad,
} from "@/lib/hero-title-paths";

const DRAW_S = 0.75;
const STAGGER_S = 0.055;
const FILL_AFTER_STROKE_S = 0.1;
const DRAW_START_S = 0.12;

const defaultPad: TitleLayoutPad = { left: true, right: true };

export type DrawnPhrasePhase =
  | "draw"
  | "hold"
  | "undraw"
  | "static"
  | "undraw-suffix"
  | "draw-suffix";

function sequenceDurationMs(glyphCount: number, phase: "draw" | "undraw"): number {
  if (glyphCount <= 0) return 400;
  const lastDelay = DRAW_START_S + (glyphCount - 1) * STAGGER_S;
  const tail = phase === "draw" ? DRAW_S + FILL_AFTER_STROKE_S : DRAW_S;
  return (lastDelay + tail) * 1000 + 60;
}

function readCachedLayout(
  text: string,
  segmentPad?: TitleLayoutPad,
): TitleLayout | null {
  if (typeof window === "undefined" || !text) return null;
  return peekTitleLayout(text, getHeroHeadlineFontSizePx(), segmentPad ?? defaultPad);
}

type Props = {
  text: string;
  phase: DrawnPhrasePhase;
  /** `rest` = fill + traço fixos (ex.: prefixo "I "). `animated` = draw/hold/undraw. */
  appearance?: "animated" | "rest";
  onDrawComplete?: () => void;
  onUndrawComplete?: () => void;
  onLayout?: (layout: TitleLayout) => void;
  /** Segmento após outro na mesma linha: sem pad duplo no meio. */
  segmentPad?: TitleLayoutPad;
  /** Em undraw/draw-suffix: glifos anteriores ficam em repouso (mesmo SVG da linha inteira). */
  holdGlyphCount?: number;
  className?: string;
  fallbackClassName?: string;
};

export function HeroDrawnPhrase({
  text,
  phase,
  appearance = "animated",
  onDrawComplete,
  onUndrawComplete,
  onLayout,
  segmentPad,
  holdGlyphCount = 0,
  className = "",
  fallbackClassName = "hero-headline",
}: Props) {
  const isRest = appearance === "rest";
  const drawTitle = isHeroDrawTitle();
  const animPhase: DrawnPhrasePhase =
    phase === "undraw-suffix" ? "undraw" : phase === "draw-suffix" ? "draw" : phase;
  const isUndraw = animPhase === "undraw" && !isRest && drawTitle;
  const isSuffixPhase = phase === "undraw-suffix" || phase === "draw-suffix";
  const gradientId = useId().replace(/:/g, "");

  const [layout, setLayout] = useState<TitleLayout | null>(() =>
    readCachedLayout(text, segmentPad),
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(() =>
    readCachedLayout(text, segmentPad) ? "ready" : "loading",
  );
  /** 1º frame em hold completo antes de arrancar undraw — evita piscar ao montar o sufixo. */
  const [undrawArmed, setUndrawArmed] = useState(() => !isUndraw);
  const phaseRef = useRef(phase);

  phaseRef.current = phase;

  useEffect(() => {
    void loadHeroTitleFont(HERO_HEADLINE_FONT_URL);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const build = async () => {
      const fontSize = getHeroHeadlineFontSizePx();
      if (fontSize < 8) return;

      const cached = readCachedLayout(text, segmentPad);
      if (cached && !cancelled) {
        setLayout(cached);
        setStatus("ready");
        onLayout?.(cached);
        return;
      }

      try {
        const font = await loadHeroTitleFont(HERO_HEADLINE_FONT_URL);
        if (cancelled) return;

        const next = buildTitleLayout(text, font, fontSize, segmentPad);
        if (!next) {
          setStatus("error");
          setLayout(null);
          return;
        }

        setLayout(next);
        setStatus("ready");
        onLayout?.(next);
      } catch {
        if (!cancelled) {
          setStatus("error");
          setLayout(null);
        }
      }
    };

    void build();

    const onResize = () => {
      void build();
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [onLayout, segmentPad, text]);

  const ready = status === "ready" && layout;

  useLayoutEffect(() => {
    if (!isUndraw || !ready) {
      setUndrawArmed(!isUndraw);
      return;
    }

    setUndrawArmed(false);
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setUndrawArmed(true));
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isUndraw, ready, text, segmentPad]);

  useEffect(() => {
    if (isRest || !ready || !layout) return;

    const count = layout.glyphs.length;
    const animCount =
      isSuffixPhase && holdGlyphCount > 0
        ? Math.max(0, count - holdGlyphCount)
        : count;
    const staticMode = phase === "static" || phase === "hold" || !drawTitle;

    if (staticMode && phase === "static") return;

    if ((phase === "draw" || phase === "draw-suffix") && drawTitle) {
      const ms = sequenceDurationMs(animCount, "draw");
      const t = window.setTimeout(() => {
        if (phaseRef.current === "draw" || phaseRef.current === "draw-suffix") {
          onDrawComplete?.();
        }
      }, ms);
      return () => window.clearTimeout(t);
    }

    if ((phase === "undraw" || phase === "undraw-suffix") && drawTitle && undrawArmed) {
      const ms = sequenceDurationMs(animCount, "undraw");
      const t = window.setTimeout(() => {
        if (phaseRef.current === "undraw" || phaseRef.current === "undraw-suffix") {
          onUndrawComplete?.();
        }
      }, ms);
      return () => window.clearTimeout(t);
    }
  }, [
    drawTitle,
    holdGlyphCount,
    isRest,
    isSuffixPhase,
    layout,
    onDrawComplete,
    onUndrawComplete,
    phase,
    ready,
    undrawArmed,
  ]);

  const strokeW = layout ? Math.max(1.5, layout.height * 0.035) : 2;
  const glyphCount = layout?.glyphs.length ?? 0;
  const showDraw = !isRest && animPhase === "draw" && drawTitle && ready;
  const showUndraw = isUndraw && ready && undrawArmed;
  const showHoldAll =
    ready &&
    (isRest || animPhase === "hold" || (isUndraw && !undrawArmed));
  const showStatic = !isRest && (animPhase === "static" || !drawTitle) && ready;
  const showFallback = status === "error" && !layout;

  const renderGlyphs = () => {
    if (!layout) return null;

    const holdGlyphs = Math.max(
      0,
      Math.min(holdGlyphCount, layout.glyphs.length),
    );
    const suffixAnimCount = Math.max(0, glyphCount - holdGlyphs);

    return layout.glyphs.map((glyph, i) => {
      const isStableGlyph = isSuffixPhase && i < holdGlyphs;
      const animIndex = isSuffixPhase ? i - holdGlyphs : i;
      const drawDelay = DRAW_START_S + animIndex * STAGGER_S;
      const undrawDelay =
        DRAW_START_S + (suffixAnimCount - 1 - animIndex) * STAGGER_S;
      const fillDelay = drawDelay + DRAW_S + FILL_AFTER_STROKE_S;
      const motionStyle = {
        "--path-len": glyph.length,
        "--draw-delay": `${undrawDelay}s`,
        "--draw-dur": `${DRAW_S}s`,
      } as React.CSSProperties;

      if (showStatic) {
        return (
          <path key={glyph.id} d={glyph.d} fill={`url(#${gradientId}-fill)`} />
        );
      }

      if (isStableGlyph || showHoldAll) {
        return (
          <g key={glyph.id}>
            <path d={glyph.d} fill={`url(#${gradientId}-fill)`} />
            <path
              d={glyph.d}
              fill="none"
              stroke={`url(#${gradientId}-stroke)`}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hero-title-stroke-rest"
              style={{ "--path-len": glyph.length } as React.CSSProperties}
            />
          </g>
        );
      }

      if (showUndraw) {
        return (
          <g key={glyph.id}>
            <path
              d={glyph.d}
              fill={`url(#${gradientId}-fill)`}
              className="hero-title-fill-out"
              style={motionStyle}
            />
            <path
              d={glyph.d}
              fill="none"
              stroke={`url(#${gradientId}-stroke)`}
              strokeWidth={strokeW}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hero-title-stroke-undraw"
              style={motionStyle}
            />
          </g>
        );
      }

      if (showDraw) {
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
                  "--draw-delay": `${drawDelay}s`,
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
      }

      return null;
    });
  };

  return (
    <span
      className={`hero-title-font hero-drawn-phrase relative inline-block max-w-full shrink-0 ${className}`}
      style={layout ? { width: layout.width, minHeight: layout.height } : undefined}
    >
      <span className="relative inline-block" suppressHydrationWarning>
        {showFallback ? (
          <span className={`block ${fallbackClassName}`} aria-hidden>
            {text}
          </span>
        ) : null}

        {layout && (showDraw || showUndraw || showHoldAll || showStatic) ? (
          <svg
            className="block overflow-visible"
            width={layout.width}
            height={layout.height}
            viewBox={layout.viewBox}
            preserveAspectRatio="xMinYMin meet"
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
            <g transform={layout.transform}>{renderGlyphs()}</g>
          </svg>
        ) : null}
      </span>
    </span>
  );
}
