"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useAnimationPaused } from "@/hooks/useAnimationPaused";

export type EducationDiploma = {
  id: string;
  title: string;
  caption?: string;
  /** Caminho em `public/` — ex.: `/diplomas/ufc-cs.jpg` */
  image: string;
  alt: string;
};

type Props = {
  title: string;
  prevLabel: string;
  nextLabel: string;
  items: EducationDiploma[];
};

function CarouselArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className="h-3.5 w-3.5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "prev" ? (
        <path d="M12.5 5 7.5 10l5 5" />
      ) : (
        <path d="M7.5 5 12.5 10l-5 5" />
      )}
    </svg>
  );
}

export function EducationDiplomaCarousel({ title, prevLabel, nextLabel, items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useAnimationPaused();
  const [brokenImages, setBrokenImages] = useState<Set<string>>(() => new Set());

  const scrollBySlide = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track || track.children.length === 0) return;

      const first = track.children[0] as HTMLElement;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0") || 8;
      const step = first.offsetWidth + gap;

      track.scrollBy({
        left: direction * step,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  if (items.length === 0) return null;

  return (
    <div
      className="education-diploma-strip"
      aria-label={title}
    >
      <button
        type="button"
        onClick={() => scrollBySlide(-1)}
        className="education-diploma-strip__nav site-chip-btn"
        aria-label={prevLabel}
      >
        <CarouselArrow direction="prev" />
      </button>

      <div
        ref={trackRef}
        className="education-diploma-strip__track"
      >
        {items.map((diploma) => {
          const broken = brokenImages.has(diploma.id);
          const label = diploma.caption ? `${diploma.title} — ${diploma.caption}` : diploma.title;

          return (
            <figure
              key={diploma.id}
              className="education-diploma-strip__slide"
              title={label}
            >
              <div className="education-diploma-strip__frame">
                {!broken ? (
                  <Image
                    src={diploma.image}
                    alt={diploma.alt}
                    width={320}
                    height={180}
                    className="h-full w-full object-cover"
                    onError={() => {
                      setBrokenImages((prev) => new Set(prev).add(diploma.id));
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--surface-elevated)]/90 px-2 text-center">
                    <span className="line-clamp-2 text-[9px] font-medium leading-tight text-[var(--muted)]">
                      {diploma.title}
                    </span>
                  </div>
                )}
              </div>
            </figure>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scrollBySlide(1)}
        className="education-diploma-strip__nav site-chip-btn"
        aria-label={nextLabel}
      >
        <CarouselArrow direction="next" />
      </button>
    </div>
  );
}
