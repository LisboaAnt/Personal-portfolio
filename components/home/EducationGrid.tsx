"use client";

import { useMemo } from "react";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";
import {
  EDUCATION_BACHELOR_CARD_ID,
  useWorldEducationStore,
} from "@/stores/world-education-store";

export type EducationItem = {
  id: string;
  period: string;
  title: string;
  institution: string;
  meta: string;
  bullets: string[];
};

/** Bacharelado sempre ao centro; restantes por ordem cronológica. */
const EDUCATION_DISPLAY_ORDER = ["senai", EDUCATION_BACHELOR_CARD_ID, "ufc-mentor"] as const;

function sortEducationItems(items: EducationItem[]): EducationItem[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return EDUCATION_DISPLAY_ORDER.map((id) => byId.get(id)).filter(
    (item): item is EducationItem => item != null,
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="none"
      className={[
        "education-card__chevron h-3.5 w-3.5 shrink-0 text-[var(--muted)] transition-transform duration-300",
        open ? "rotate-180" : "",
      ].join(" ")}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 7.5 10 12.5 15 7.5" />
    </svg>
  );
}

export function EducationGrid({ items }: { items: EducationItem[] }) {
  const ordered = useMemo(() => sortEducationItems(items), [items]);
  const openId = useWorldEducationStore((s) => s.activeCardId);
  const setActiveCard = useWorldEducationStore((s) => s.setActiveCard);

  const toggleCard = (id: string) => {
    setActiveCard(openId === id ? null : id);
  };

  return (
    <MotionStagger className="education-accordion mx-auto grid w-full max-w-5xl grid-cols-3 gap-3 sm:gap-4">
      {ordered.map((edu) => {
        const featured = edu.id === EDUCATION_BACHELOR_CARD_ID;
        const open = openId === edu.id;

        return (
          <MotionStaggerItem key={edu.id} className="min-w-0 self-start">
            <article
              className={[
                "education-card overflow-hidden rounded-xl border bg-[var(--surface-elevated)]/85 backdrop-blur-md transition-[border-color,box-shadow] duration-300",
                open ? "education-card--open" : "",
                featured
                  ? "education-card--featured border-[color-mix(in_srgb,var(--accent)_42%,var(--border))] shadow-[0_10px_28px_-16px_color-mix(in_srgb,var(--accent)_55%,transparent)] sm:-translate-y-0.5"
                  : "border-[var(--border)] hover:border-[color-mix(in_srgb,var(--accent)_28%,var(--border))]",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => toggleCard(edu.id)}
                aria-expanded={open}
                className="flex w-full items-start justify-between gap-2 px-2.5 py-2 text-left sm:px-3 sm:py-2.5"
              >
                <span
                  className={[
                    "block min-w-0 leading-snug text-[var(--foreground)]",
                    featured
                      ? "text-xs font-semibold sm:text-sm"
                      : "text-[0.75rem] font-medium sm:text-xs",
                  ].join(" ")}
                >
                  {edu.title}
                </span>
                <ChevronIcon open={open} />
              </button>

              {open ? (
                <div className="border-t border-[var(--border)] px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {edu.period}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{edu.institution}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {edu.meta}
                  </p>
                  {edu.bullets.length ? (
                    <ul className="mt-3 space-y-1.5 text-xs text-[var(--muted)] sm:text-sm">
                      {edu.bullets.map((b) => (
                        <li key={b} className="flex gap-2 leading-relaxed">
                          <span
                            aria-hidden
                            className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]/60"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}
            </article>
          </MotionStaggerItem>
        );
      })}
    </MotionStagger>
  );
}
