"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { EducationItem } from "./EducationGrid";

type Labels = {
  close: string;
  topicsHeading: string;
  highlightsHeading: string;
};

type Props = {
  item: EducationItem | null;
  labels: Labels;
  onClose: () => void;
};

export function EducationDetailModal({ item, labels, onClose }: Props) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!item) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {item ? (
        <motion.div
          key="education-modal-overlay"
          className="education-modal fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="education-modal-panel"
            className="education-modal__panel relative flex w-full max-w-3xl flex-col rounded-2xl"
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Camada só para o botão: fica acima do scroll e não compete com o hit-test
                da área overflow (que no modal da UFC, por ser mais alto, roubava o clique). */}
            <div className="education-modal__toolbar pointer-events-none absolute inset-x-0 top-0 z-20 h-14 sm:h-16">
              <button
                type="button"
                onClick={onClose}
                aria-label={labels.close}
                className="education-modal__close site-chip-btn pointer-events-auto absolute right-4 top-4 sm:right-6 sm:top-6"
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

            <div className="education-modal__scroll min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
              <header className="education-modal__header pr-10 sm:pr-12">
                <p className="education-modal__period text-xs font-semibold uppercase tracking-[0.16em]">
                  {item.period}
                </p>
                <h3 className="education-modal__title mt-1 text-xl font-semibold sm:text-2xl">
                  {item.title}
                </h3>
                <p className="education-modal__institution mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                  <span>{item.institution}</span>
                  {item.meta ? (
                    <span className="education-modal__chip rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                      {item.meta}
                    </span>
                  ) : null}
                </p>
              </header>

              {item.summary ? (
                <p className="education-modal__summary mt-5 text-sm leading-relaxed sm:text-base">
                  {item.summary}
                </p>
              ) : null}

              {item.topics && item.topics.length > 0 ? (
                <div className="mt-6">
                  <h4 className="education-modal__section-heading text-xs font-semibold uppercase tracking-[0.14em]">
                    {labels.topicsHeading}
                  </h4>
                  <div className="education-modal__topics mt-3 grid gap-3 sm:grid-cols-2">
                    {item.topics.map((topic) => (
                      <article key={topic.id} className="education-modal__topic rounded-xl p-3.5 sm:p-4">
                        <h5 className="education-modal__topic-title text-sm font-semibold">
                          {topic.title}
                        </h5>
                        <p className="education-modal__topic-desc mt-1.5 text-[13px] leading-relaxed sm:text-sm">
                          {topic.description}
                        </p>
                        {topic.image ? (
                          <div className="education-modal__topic-media mt-3 overflow-hidden rounded-lg">
                            <Image
                              src={topic.image}
                              alt={topic.imageAlt ?? topic.title}
                              width={640}
                              height={360}
                              className="h-auto w-full object-cover"
                            />
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : item.bullets && item.bullets.length > 0 ? (
                <div className="mt-6">
                  <h4 className="education-modal__section-heading text-xs font-semibold uppercase tracking-[0.14em]">
                    {labels.highlightsHeading}
                  </h4>
                  <ul className="education-modal__bullets mt-3 space-y-2 text-sm leading-relaxed">
                    {item.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span aria-hidden className="education-modal__bullet-dot mt-2 h-1 w-1 shrink-0 rounded-full" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {item.gallery && item.gallery.length > 0 ? (
                <div className="mt-6">
                  <h4 className="education-modal__section-heading text-xs font-semibold uppercase tracking-[0.14em]">
                    {labels.highlightsHeading}
                  </h4>
                  <div className="education-modal__gallery mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {item.gallery.map((photo) => (
                      <div key={photo.src} className="education-modal__gallery-frame overflow-hidden rounded-lg">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          width={320}
                          height={220}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
