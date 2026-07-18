"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  closeLabel: string;
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

function ModalArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className="h-5 w-5"
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

export function EducationDiplomaCarousel({
  title,
  prevLabel,
  nextLabel,
  closeLabel,
  items,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useAnimationPaused();
  const reduceMotion = useReducedMotion();
  const [brokenImages, setBrokenImages] = useState<Set<string>>(() => new Set());
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const goPrev = useCallback(() => {
    setOpenIndex((i) => {
      if (i == null || items.length === 0) return i;
      return (i - 1 + items.length) % items.length;
    });
  }, [items.length]);

  const goNext = useCallback(() => {
    setOpenIndex((i) => {
      if (i == null || items.length === 0) return i;
      return (i + 1) % items.length;
    });
  }, [items.length]);

  const closeModal = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (openIndex == null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, closeModal, goPrev, goNext]);

  if (items.length === 0) return null;

  const openDiploma = openIndex != null ? items[openIndex] : null;

  const modal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {openDiploma ? (
          <motion.div
            key="diploma-lightbox"
            className="education-diploma-modal fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={openDiploma.title}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              className="education-diploma-modal__panel relative flex w-full max-w-4xl flex-col"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, y: 8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="education-diploma-modal__toolbar flex items-start justify-between gap-3 px-1 pb-3">
                <div className="min-w-0">
                  <p className="education-diploma-modal__title truncate text-sm font-semibold sm:text-base">
                    {openDiploma.title}
                  </p>
                  {openDiploma.caption ? (
                    <p className="education-diploma-modal__caption truncate text-xs sm:text-sm">
                      {openDiploma.caption}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label={closeLabel}
                  className="education-diploma-modal__close site-chip-btn shrink-0"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 5 15 15M15 5 5 15" />
                  </svg>
                </button>
              </div>

              <div className="education-diploma-modal__stage relative flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label={prevLabel}
                  className="education-diploma-modal__nav site-chip-btn shrink-0"
                >
                  <ModalArrow direction="prev" />
                </button>

                <div className="education-diploma-modal__frame min-w-0 flex-1 overflow-hidden">
                  <Image
                    key={openDiploma.id}
                    src={openDiploma.image}
                    alt={openDiploma.alt}
                    width={1200}
                    height={850}
                    className="h-auto max-h-[min(72vh,720px)] w-full object-contain"
                    priority
                  />
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label={nextLabel}
                  className="education-diploma-modal__nav site-chip-btn shrink-0"
                >
                  <ModalArrow direction="next" />
                </button>
              </div>

              <p className="education-diploma-modal__counter mt-3 text-center text-[11px] uppercase tracking-[0.14em]">
                {(openIndex ?? 0) + 1} / {items.length}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );

  return (
    <>
      <div className="education-diploma-strip" aria-label={title}>
        <button
          type="button"
          onClick={() => scrollBySlide(-1)}
          className="education-diploma-strip__nav site-chip-btn"
          aria-label={prevLabel}
        >
          <CarouselArrow direction="prev" />
        </button>

        <div ref={trackRef} className="education-diploma-strip__track">
          {items.map((diploma, index) => {
            const broken = brokenImages.has(diploma.id);
            const label = diploma.caption
              ? `${diploma.title} — ${diploma.caption}`
              : diploma.title;

            return (
              <button
                key={diploma.id}
                type="button"
                className="education-diploma-strip__slide"
                title={label}
                aria-label={label}
                onClick={() => setOpenIndex(index)}
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
                    <div className="flex h-full w-full items-center justify-center px-2 text-center">
                      <span className="education-diploma-strip__fallback line-clamp-2 text-[9px] font-medium leading-tight">
                        {diploma.title}
                      </span>
                    </div>
                  )}
                </div>
                <span className="education-diploma-strip__caption line-clamp-1 px-0.5">
                  {diploma.title}
                </span>
              </button>
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
      {modal}
    </>
  );
}
