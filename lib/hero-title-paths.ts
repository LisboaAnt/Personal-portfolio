import type { Font } from "fontkit";

export type TitleGlyph = {
  id: string;
  d: string;
  length: number;
};

export type TitleLayout = {
  glyphs: TitleGlyph[];
  viewBox: string;
  transform: string;
  width: number;
  height: number;
};

/** Padding horizontal do SVG — segmentos adjacentes partilham o meio sem “salto”. */
export type TitleLayoutPad = {
  left?: boolean;
  right?: boolean;
};

const defaultPad: TitleLayoutPad = { left: true, right: true };

const lengthCache = new Map<string, number>();
const layoutCache = new Map<string, TitleLayout>();

function layoutCacheKey(
  text: string,
  fontSize: number,
  padSides: TitleLayoutPad,
): string {
  const pl = padSides.left !== false ? 1 : 0;
  const pr = padSides.right !== false ? 1 : 0;
  return `${fontSize}|${pl}|${pr}|${text}`;
}

/** Layout já calculado (ex.: após preload) — evita 1º frame vazio ao montar segmento. */
export function peekTitleLayout(
  text: string,
  fontSize: number,
  padSides: TitleLayoutPad = defaultPad,
): TitleLayout | null {
  if (!text) return null;
  return layoutCache.get(layoutCacheKey(text, fontSize, padSides)) ?? null;
}

export const HERO_HEADLINE_FONT_URL = "/fonts/MedievalSharp-Regular.woff2";

/** Headline SVG: alinhado a clamp(2.75rem, 9vw, 4.75rem). */
export function getHeroHeadlineFontSizePx(): number {
  if (typeof window === "undefined") return 44;
  const vw = window.innerWidth * 0.09;
  return Math.round(Math.min(Math.max(vw, 44), 76));
}

/** Tamanhos Tailwind legado (nome) — mantido para referência. */
export function getHeroTitleFontSizePx(): number {
  if (typeof window === "undefined") return 36;
  if (window.matchMedia("(min-width: 1024px)").matches) return 60;
  if (window.matchMedia("(min-width: 640px)").matches) return 48;
  return 36;
}

function roundCoord(n: number): number {
  return Math.round(n * 100) / 100;
}

function pathCommandsToD(
  commands: { command: string; args: number[] }[],
): string {
  return commands
    .map((c) => {
      const args = c.args.map(roundCoord);
      switch (c.command) {
        case "moveTo":
          return `M${args.join(" ")}`;
        case "lineTo":
          return `L${args.join(" ")}`;
        case "curveTo":
          return `C${args.join(" ")}`;
        case "quadraticCurveTo":
          return `Q${args.join(" ")}`;
        case "closePath":
          return "Z";
        default:
          return "";
      }
    })
    .join(" ");
}

function isValidPathData(d: string): boolean {
  if (!d || d.length < 4) return false;
  if (/\bNaN\b|Infinity/.test(d)) return false;
  return true;
}

export function measurePathLength(d: string): number {
  if (!isValidPathData(d)) return 400;

  const cached = lengthCache.get(d);
  if (cached !== undefined) return cached;

  if (typeof document === "undefined") return 400;

  try {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    const length = path.getTotalLength();
    if (!Number.isFinite(length) || length <= 0) return 400;
    lengthCache.set(d, length);
    return length;
  } catch {
    return 400;
  }
}

type Bbox = { x1: number; y1: number; x2: number; y2: number };

function isValidBBox(bbox: Bbox) {
  return [bbox.x1, bbox.y1, bbox.x2, bbox.y2].every((n) => Number.isFinite(n));
}

function unionBBox(acc: Bbox | null, path: { bbox?: { minX: number; minY: number; maxX: number; maxY: number } }): Bbox | null {
  const b = path.bbox;
  if (!b) return acc;
  if (!acc) {
    return { x1: b.minX, y1: b.minY, x2: b.maxX, y2: b.maxY };
  }
  return {
    x1: Math.min(acc.x1, b.minX),
    y1: Math.min(acc.y1, b.minY),
    x2: Math.max(acc.x2, b.maxX),
    y2: Math.max(acc.y2, b.maxY),
  };
}

/** Largura do texto (inclui avanço de espaços). */
const LAYOUT_FEATURES = {
  liga: false,
  locl: false,
  calt: false,
  clig: false,
} as const;

/**
 * Quantos glifos do layout de `fullText` pertencem ao prefixo `prefixText`.
 * Usa o avanço tipográfico da linha inteira para o corte não deslocar o prefixo estável.
 */
export function countPrefixGlyphsInFull(
  fullText: string,
  prefixText: string,
  font: Font,
  fontSize: number,
): number {
  if (!fullText || !prefixText) return 0;

  const scale = fontSize / font.unitsPerEm;
  const prefixRun = font.layout(prefixText, LAYOUT_FEATURES);
  let targetAdvance = 0;
  for (let i = 0; i < prefixRun.positions.length; i++) {
    targetAdvance += prefixRun.positions[i]!.xAdvance * scale;
  }

  const fullRun = font.layout(fullText, LAYOUT_FEATURES);
  if (fullRun.glyphs.length === 0) return 0;

  let x = 0;
  for (let i = 0; i < fullRun.glyphs.length; i++) {
    x += fullRun.positions[i]!.xAdvance * scale;
    if (x >= targetAdvance - 0.25) {
      return i + 1;
    }
  }

  return Math.min(prefixRun.glyphs.length, fullRun.glyphs.length);
}

export function measureTitleTextWidth(
  text: string,
  font: Font,
  fontSize: number,
  pad: TitleLayoutPad = defaultPad,
): number {
  if (!text) return 0;
  const layout = buildTitleLayout(text, font, fontSize, pad);
  return layout?.width ?? 0;
}

/** Quebra por palavras para caber em `maxWidth` (fluxo contínuo tipo parágrafo). */
export function breakTitleIntoLines(
  text: string,
  font: Font,
  fontSize: number,
  maxWidth: number,
): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (maxWidth <= 0) return [trimmed];

  const words = trimmed.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    const w = measureTitleTextWidth(candidate, font, fontSize);
    if (w > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines.length > 0 ? lines : [trimmed];
}

export function buildTitleLayout(
  text: string,
  font: Font,
  fontSize: number,
  padSides: TitleLayoutPad = defaultPad,
): TitleLayout | null {
  if (!Number.isFinite(fontSize) || fontSize < 8) return null;

  const scale = fontSize / font.unitsPerEm;
  const run = font.layout(text, LAYOUT_FEATURES);
  const glyphs: TitleGlyph[] = [];
  let x = 0;
  let bbox: Bbox | null = null;

  for (let i = 0; i < run.glyphs.length; i++) {
    const glyphRun = run.glyphs[i]!;
    const pos = run.positions[i]!;
    const glyph = font.getGlyph(glyphRun.id);
    const xOffset = pos.xOffset * scale;
    const yOffset = pos.yOffset * scale;

    if (glyph.path && glyph.path.commands.length > 0) {
      const path = glyph.path.scale(scale).translate(x + xOffset, -yOffset);
      const d = pathCommandsToD(path.commands);
      if (isValidPathData(d)) {
        glyphs.push({
          id: `${i}-${glyphRun.id}`,
          d,
          length: measurePathLength(d),
        });
        bbox = unionBBox(bbox, path);
      }
    }

    x += pos.xAdvance * scale;
  }

  if (glyphs.length === 0 || !bbox || !isValidBBox(bbox)) return null;

  const padY = fontSize * 0.08;
  const padL = padSides.left !== false ? padY : 0;
  const padR = padSides.right !== false ? padY : 0;
  const ascent = (font.ascent ?? 0) * scale;
  const descent = Math.abs(font.descent ?? 0) * scale;
  const lineHeight = ascent + descent;
  /** Inclui avanço de espaços (glifos sem contorno não entram no bbox). */
  const contentW = Math.max(x, bbox.x2 - bbox.x1);
  const w = contentW + padL + padR;
  const h = lineHeight + padY * 2;
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;

  const result: TitleLayout = {
    glyphs,
    viewBox: `0 0 ${w} ${h}`,
    transform: `translate(${-bbox.x1 + padL}, ${ascent + padY}) scale(1, -1)`,
    width: w,
    height: h,
  };

  layoutCache.set(layoutCacheKey(text, fontSize, padSides), result);
  return result;
}

const fontCacheByUrl = new Map<string, Promise<Font>>();

/** Pré-calcula layouts (cache de fontkit + measurePathLength) antes de montar SVGs. */
export async function preloadTitleLayouts(
  items: { text: string; pad?: TitleLayoutPad }[],
  fontUrl: string = HERO_HEADLINE_FONT_URL,
): Promise<void> {
  const font = await loadHeroTitleFont(fontUrl);
  const fontSize = getHeroHeadlineFontSizePx();
  for (const { text, pad } of items) {
    if (!text) continue;
    buildTitleLayout(text, font, fontSize, pad);
  }
}

export function loadHeroTitleFont(url: string): Promise<Font> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Font load is client-only"));
  }

  let cached = fontCacheByUrl.get(url);
  if (!cached) {
    cached = (async () => {
      const fontkit = await import("fontkit");
      const create = fontkit.default?.create ?? fontkit.create;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Font fetch failed (${res.status}): ${url}`);
      }
      const buffer = await res.arrayBuffer();
      return create(new Uint8Array(buffer) as unknown as Buffer) as Font;
    })();
    fontCacheByUrl.set(url, cached);
  }

  return cached;
}
