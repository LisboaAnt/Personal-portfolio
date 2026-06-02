"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { isHeroDrawTitle } from "@/lib/hero-enter";
import {
  getHeroHeadlineFontSizePx,
  HERO_HEADLINE_FONT_URL,
  loadHeroTitleFont,
  breakTitleIntoLines,
  preloadTitleLayouts,
} from "@/lib/hero-title-paths";
import {
  planPhraseTransition,
  headlineLineSegmentPad,
  lastAnimatingLineIndex,
  type LinePlan,
  type TransitionPlan,
} from "@/lib/hero-title-transition";
import { HeroDrawnPhrase, type DrawnPhrasePhase } from "@/components/home/HeroDrawnPhrase";

const HOLD_MS = 2400;
const LINE_GAP_EM = 0.06;

type Props = {
  prefix: string;
  phrases: string[];
  ariaLabel: string;
};

type SmartView = {
  phase: "undraw" | "draw";
  linesA: string[];
  linesB: string[];
  linePlans: LinePlan[];
};

function HeadlineLineStack({
  copy,
  children,
  className = "",
}: {
  copy: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`hero-headline-line-stack ${className}`.trim()}>
      <span className="hero-headline-copy" aria-hidden>
        {copy}
      </span>
      <span className="hero-headline-visual">{children}</span>
    </span>
  );
}

async function computeHeadlineLines(text: string, maxWidth: number): Promise<string[]> {
  const font = await loadHeroTitleFont(HERO_HEADLINE_FONT_URL);
  const fontSize = getHeroHeadlineFontSizePx();
  const lines = breakTitleIntoLines(text.trim(), font, fontSize, maxWidth);
  return lines.length > 0 ? lines : [text.trim()];
}

async function preloadSmartPlan(plan: Extract<TransitionPlan, { type: "smart" }>) {
  const items: { text: string; pad?: ReturnType<typeof headlineLineSegmentPad> }[] = [];
  const n = plan.linesA.length;

  plan.linePlans.forEach((lp, i) => {
    const pad = headlineLineSegmentPad(i, n, "whole");
    if (lp.type === "suffix") {
      items.push({ text: plan.linesA[i]!, pad }, { text: plan.linesB[i]!, pad });
    } else if (lp.type === "replace") {
      items.push({ text: plan.linesA[i]!, pad }, { text: plan.linesB[i]!, pad });
    }
  });

  if (items.length > 0) await preloadTitleLayouts(items);
}

export function HeroRotatingHeadline({ prefix, phrases, ariaLabel }: Props) {
  const reduced = useReducedMotion();
  const drawTitle = isHeroDrawTitle();
  const containerRef = useRef<HTMLSpanElement>(null);
  const pendingPlan = useRef<TransitionPlan | null>(null);
  const pendingIndex = useRef<number>(0);

  const safePhrases = useMemo(
    () => (phrases.length > 0 ? phrases : ["…"]),
    [phrases],
  );

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<DrawnPhrasePhase>("draw");
  const [maxWidth, setMaxWidth] = useState(0);
  const [holdLines, setHoldLines] = useState<string[]>([]);
  const [frozenLines, setFrozenLines] = useState<string[] | null>(null);
  const [smartView, setSmartView] = useState<SmartView | null>(null);

  const current = safePhrases[index]!;
  const staticMode = reduced || !drawTitle || safePhrases.length <= 1;

  const prefixText = prefix.trim()
    ? prefix.endsWith(" ")
      ? prefix
      : `${prefix} `
    : "";

  const fullText = `${prefixText}${current}`;

  const contentWidth =
    maxWidth > 0
      ? maxWidth
      : typeof window !== "undefined"
        ? Math.min(window.innerWidth - 48, 768)
        : 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setMaxWidth(w);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /** Linhas em repouso / modo estático. */
  useEffect(() => {
    if (smartView || frozenLines) return;
    if (!staticMode && phase !== "hold") return;
    if (contentWidth <= 0) return;

    let cancelled = false;

    const layoutLines = async () => {
      try {
        const next = await computeHeadlineLines(fullText, contentWidth);
        if (!cancelled) setHoldLines(next);
      } catch {
        if (!cancelled) setHoldLines([fullText.trim()]);
      }
    };

    void layoutLines();
    return () => {
      cancelled = true;
    };
  }, [contentWidth, fullText, smartView, frozenLines, phase, staticMode]);

  /** Primeiro draw: congela quebra de linha antes de animar. */
  useEffect(() => {
    if (staticMode || smartView || frozenLines) return;
    if (phase !== "draw" || contentWidth <= 0) return;

    let cancelled = false;

    const freeze = async () => {
      try {
        const next = await computeHeadlineLines(fullText, contentWidth);
        if (!cancelled) {
          setHoldLines(next);
          setFrozenLines(next);
        }
      } catch {
        if (!cancelled) setFrozenLines([fullText.trim()]);
      }
    };

    void freeze();
    return () => {
      cancelled = true;
    };
  }, [contentWidth, fullText, frozenLines, phase, smartView, staticMode]);

  const beginTransition = useCallback(async () => {
    if (staticMode || contentWidth <= 0) return;

    const nextIndex = (index + 1) % safePhrases.length;
    const nextPhrase = safePhrases[nextIndex]!;

    try {
      const font = await loadHeroTitleFont(HERO_HEADLINE_FONT_URL);
      const fontSize = getHeroHeadlineFontSizePx();
      const plan = planPhraseTransition(
        prefixText,
        current,
        nextPhrase,
        font,
        fontSize,
        contentWidth,
      );

      pendingPlan.current = plan;
      pendingIndex.current = nextIndex;

      setFrozenLines(plan.linesA);

      if (plan.type === "smart") {
        try {
          await preloadSmartPlan(plan);
        } catch {
          /* ok */
        }
        setSmartView({
          phase: "undraw",
          linesA: plan.linesA,
          linesB: plan.linesB,
          linePlans: plan.linePlans,
        });
      } else {
        setPhase("undraw");
      }
    } catch {
      setPhase("undraw");
    }
  }, [contentWidth, current, index, prefixText, safePhrases, staticMode]);

  const commitHoldLines = useCallback((lines: string[]) => {
    if (lines.length > 0) setHoldLines(lines);
  }, []);

  const finishToHold = useCallback(() => {
    const plan = pendingPlan.current;
    if (plan?.linesB.length) commitHoldLines(plan.linesB);
    else if (frozenLines?.length) commitHoldLines(frozenLines);
    setSmartView(null);
    setFrozenLines(null);
    setPhase("hold");
  }, [commitHoldLines, frozenLines]);

  const handleDrawComplete = useCallback(() => {
    if (staticMode) return;
    if (smartView?.phase === "draw") {
      finishToHold();
      return;
    }
    const plan = pendingPlan.current;
    if (plan?.linesB.length) commitHoldLines(plan.linesB);
    else if (frozenLines?.length) commitHoldLines(frozenLines);
    setFrozenLines(null);
    setPhase("hold");
  }, [commitHoldLines, finishToHold, frozenLines, smartView, staticMode]);

  const handleUndrawComplete = useCallback(() => {
    if (staticMode) return;

    if (smartView?.phase === "undraw") {
      const plan = pendingPlan.current;
      if (plan?.type === "smart") {
        setIndex(pendingIndex.current);
        setFrozenLines(plan.linesB);
        setSmartView({
          phase: "draw",
          linesA: plan.linesA,
          linesB: plan.linesB,
          linePlans: plan.linePlans,
        });
      } else if (plan?.type === "full") {
        setIndex(pendingIndex.current);
        setFrozenLines(plan.linesB);
        setPhase("draw");
      }
      return;
    }

    const plan = pendingPlan.current;
    if (plan) {
      setFrozenLines(plan.linesB);
    }
    setIndex((i) => (i + 1) % safePhrases.length);
    setPhase("draw");
  }, [finishToHold, smartView, staticMode, safePhrases.length]);

  useEffect(() => {
    if (staticMode || phase !== "hold" || smartView) return;
    const t = window.setTimeout(() => {
      void beginTransition();
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [beginTransition, phase, smartView, staticMode]);

  const displayPhase: DrawnPhrasePhase = staticMode ? "static" : phase;
  const lineGapPx =
    typeof window !== "undefined"
      ? getHeroHeadlineFontSizePx() * LINE_GAP_EM
      : 0;

  const activeLines = useMemo(() => {
    if (smartView) {
      return smartView.phase === "undraw" ? smartView.linesA : smartView.linesB;
    }
    if (frozenLines && frozenLines.length > 0) return frozenLines;
    if (holdLines.length > 0) return holdLines;
    return [fullText.trim()];
  }, [smartView, frozenLines, holdLines, fullText]);

  const lineCount = activeLines.length;
  const smartAnimIndex = smartView ? lastAnimatingLineIndex(smartView.linePlans) : -1;

  const renderLine = (lineIndex: number, lineText: string) => {
    const isLastLine = lineIndex === lineCount - 1;
    const wholePad = headlineLineSegmentPad(lineIndex, lineCount, "whole");

    const plan = smartView?.linePlans[lineIndex];
    const isSmartAnimLine = smartView && plan && plan.type !== "rest" && lineIndex === smartAnimIndex;

    if (!smartView) {
      return (
        <HeroDrawnPhrase
          text={lineText}
          phase={displayPhase}
          segmentPad={wholePad}
          onDrawComplete={isLastLine ? handleDrawComplete : undefined}
          onUndrawComplete={isLastLine ? handleUndrawComplete : undefined}
          className="block"
          fallbackClassName="hero-headline"
        />
      );
    }

    if (!plan || plan.type === "rest") {
      return (
        <HeroDrawnPhrase
          text={lineText}
          phase="hold"
          appearance="rest"
          segmentPad={wholePad}
          className="block"
          fallbackClassName="hero-headline"
        />
      );
    }

    if (plan.type === "suffix") {
      const holdGlyphCount =
        smartView.phase === "undraw" ? plan.holdGlyphCountA : plan.holdGlyphCountB;
      const suffixPhase: DrawnPhrasePhase =
        smartView.phase === "undraw" ? "undraw-suffix" : "draw-suffix";
      return (
        <HeroDrawnPhrase
          text={lineText}
          phase={suffixPhase}
          segmentPad={wholePad}
          holdGlyphCount={holdGlyphCount}
          onDrawComplete={isSmartAnimLine ? handleDrawComplete : undefined}
          onUndrawComplete={isSmartAnimLine ? handleUndrawComplete : undefined}
          className="block"
          fallbackClassName="hero-headline"
        />
      );
    }

    if (plan.type === "replace") {
      const animPhase: DrawnPhrasePhase =
        smartView.phase === "undraw" ? "undraw" : "draw";
      return (
        <HeroDrawnPhrase
          text={lineText}
          phase={animPhase}
          segmentPad={wholePad}
          onDrawComplete={isSmartAnimLine ? handleDrawComplete : undefined}
          onUndrawComplete={isSmartAnimLine ? handleUndrawComplete : undefined}
          className="block"
          fallbackClassName="hero-headline"
        />
      );
    }

    return null;
  };

  const copyForLine = (lineIndex: number, lineText: string) => {
    const plan = smartView?.linePlans[lineIndex];
    if (plan?.type === "suffix") {
      const mutable =
        smartView!.phase === "undraw" ? plan.undrawSuffix : plan.drawSuffix;
      return `${plan.stable}${mutable}`;
    }
    return lineText;
  };

  if (staticMode) {
    const staticLines =
      holdLines.length > 0 ? holdLines : [fullText.trim()];
    return (
      <h1 className="hero-headline hero-title-font w-full max-w-full leading-none">
        <span className="sr-only">{ariaLabel}</span>
        <span
          ref={containerRef}
          className="hero-headline-line"
          style={staticLines.length > 1 ? { rowGap: lineGapPx } : undefined}
        >
          {staticLines.map((line, lineIndex) => (
            <HeadlineLineStack key={`static-${lineIndex}`} copy={line}>
              <span className="hero-headline-static-text">{line}</span>
            </HeadlineLineStack>
          ))}
        </span>
      </h1>
    );
  }

  return (
    <h1 className="hero-headline hero-title-font w-full max-w-full leading-none">
      <span className="sr-only">{ariaLabel}</span>
      <span
        ref={containerRef}
        className="hero-headline-line"
        style={lineCount > 1 ? { rowGap: lineGapPx } : undefined}
      >
        {activeLines.map((line, lineIndex) => (
          <HeadlineLineStack
            key={`${index}-${lineIndex}`}
            copy={copyForLine(lineIndex, line)}
            className="hero-headline-line-segment w-full max-w-full"
          >
            {renderLine(lineIndex, line)}
          </HeadlineLineStack>
        ))}
      </span>
    </h1>
  );
}
