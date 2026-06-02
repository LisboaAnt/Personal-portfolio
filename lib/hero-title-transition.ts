import type { Font } from "fontkit";
import {
  breakTitleIntoLines,
  countPrefixGlyphsInFull,
  measureTitleTextWidth,
  type TitleLayoutPad,
} from "./hero-title-paths";

export type LinePlan =
  | { type: "rest" }
  | {
      type: "suffix";
      stable: string;
      undrawSuffix: string;
      drawSuffix: string;
      holdGlyphCountA: number;
      holdGlyphCountB: number;
    }
  | { type: "replace" };

export type SmartTransition = {
  type: "smart";
  linesA: string[];
  linesB: string[];
  linePlans: LinePlan[];
};

export type FullTransition = {
  type: "full";
  linesA: string[];
  linesB: string[];
};

export type TransitionPlan = SmartTransition | FullTransition;

function normalizeFull(prefix: string, phrase: string): string {
  return `${prefix}${phrase}`.replace(/\s+/g, " ").trim();
}

/** Prefixo comum por palavras (ex.: "I plan" entre duas frases). */
export function longestCommonWordPrefix(a: string, b: string): string {
  const wa = a.trim().split(/\s+/).filter(Boolean);
  const wb = b.trim().split(/\s+/).filter(Boolean);
  const shared: string[] = [];
  for (let i = 0; i < Math.min(wa.length, wb.length); i++) {
    if (wa[i] === wb[i]) shared.push(wa[i]);
    else break;
  }
  return shared.join(" ");
}

function suffixAfterCommon(full: string, common: string): string {
  const f = full.trim();
  const words = f.split(/\s+/).filter(Boolean);
  const cw = common.trim().split(/\s+/).filter(Boolean);
  if (cw.length === 0) return f;
  if (words.length <= cw.length) return "";
  return words.slice(cw.length).join(" ");
}

function ensureTrailingSpace(text: string): string {
  return text.endsWith(" ") ? text : `${text} `;
}

/** Padding por linha — evita pad duplo entre segmentos da mesma linha. */
export function headlineLineSegmentPad(
  lineIndex: number,
  lineCount: number,
  part: "whole" | "stable" | "mutable",
): TitleLayoutPad {
  const isFirst = lineIndex === 0;
  const isLast = lineIndex === lineCount - 1;
  const left = isFirst;
  const right = isLast;

  if (part === "whole") return { left, right };
  if (part === "stable") return { left, right: false };
  return { left: false, right };
}

export function lastAnimatingLineIndex(linePlans: LinePlan[]): number {
  for (let i = linePlans.length - 1; i >= 0; i--) {
    if (linePlans[i]?.type !== "rest") return i;
  }
  return Math.max(0, linePlans.length - 1);
}

/**
 * Plano de transição com a mesma quebra de linha em A e B.
 * Smart: por linha — rest (sem animar), suffix (só sufixo) ou replace (linha inteira).
 */
export function planPhraseTransition(
  prefix: string,
  currentPhrase: string,
  nextPhrase: string,
  font: Font,
  fontSize: number,
  maxWidth: number,
): TransitionPlan {
  const fullA = normalizeFull(prefix, currentPhrase);
  const fullB = normalizeFull(prefix, nextPhrase);

  const linesA = breakTitleIntoLines(fullA, font, fontSize, maxWidth);
  const linesB = breakTitleIntoLines(fullB, font, fontSize, maxWidth);

  const safeA = linesA.length > 0 ? linesA : [fullA];
  const safeB = linesB.length > 0 ? linesB : [fullB];

  if (safeA.length !== safeB.length) {
    return { type: "full", linesA: safeA, linesB: safeB };
  }

  const linePlans: LinePlan[] = [];
  let hasChange = false;

  for (let i = 0; i < safeA.length; i++) {
    const lineA = safeA[i]!;
    const lineB = safeB[i]!;

    if (lineA === lineB) {
      linePlans.push({ type: "rest" });
      continue;
    }

    hasChange = true;
    const common = longestCommonWordPrefix(lineA, lineB);
    const undrawSuffix = suffixAfterCommon(lineA, common);
    const drawSuffix = suffixAfterCommon(lineB, common);
    const minSuffixWidth = fontSize * 0.25;

    if (
      common &&
      undrawSuffix &&
      drawSuffix &&
      undrawSuffix !== drawSuffix &&
      measureTitleTextWidth(common, font, fontSize) >= fontSize * 0.15 &&
      measureTitleTextWidth(undrawSuffix, font, fontSize) >= minSuffixWidth &&
      measureTitleTextWidth(drawSuffix, font, fontSize) >= minSuffixWidth
    ) {
      const stable = ensureTrailingSpace(common);
      linePlans.push({
        type: "suffix",
        stable,
        undrawSuffix,
        drawSuffix,
        holdGlyphCountA: countPrefixGlyphsInFull(lineA, stable, font, fontSize),
        holdGlyphCountB: countPrefixGlyphsInFull(lineB, stable, font, fontSize),
      });
    } else {
      linePlans.push({ type: "replace" });
    }
  }

  if (!hasChange) {
    return { type: "full", linesA: safeA, linesB: safeB };
  }

  return { type: "smart", linesA: safeA, linesB: safeB, linePlans };
}
