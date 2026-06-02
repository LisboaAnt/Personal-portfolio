"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type ExperienceScrumBlock = {
  title: string;
  period: string;
  intro: string;
  bullets: string[];
};

export type ExperienceItem = {
  id: string;
  period: string;
  title: string;
  company: string;
  location: string;
  stack: string;
  bullets: string[];
  scrum?: ExperienceScrumBlock;
};

type Props = { items: ExperienceItem[] };

export function ExperienceTimeline({ items }: Props) {
  const reduced = useReducedMotion();
  const initialId = useMemo(() => {
    if (items.length === 0) return "";
    return items.find((item) => item.id === "vittahub")?.id ?? items[0]!.id;
  }, [items]);
  const [activeId, setActiveId] = useState(initialId);
  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!active) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(220px,0.95fr)_minmax(0,1.75fr)] lg:items-start">
      <aside className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/75 p-3 backdrop-blur-md lg:sticky lg:top-24">
        <ol className="space-y-2">
          {items.map((job, index) => {
            const isActive = job.id === active.id;
            return (
              <motion.li
                key={job.id}
                initial={reduced ? false : { opacity: 0, x: -12 }}
                whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setActiveId(job.id)}
                  aria-pressed={isActive}
                  className={[
                    "group w-full rounded-xl border px-3 py-3 text-left transition-all duration-300",
                    isActive
                      ? "border-[var(--accent)]/55 bg-[var(--accent-soft)]/45 shadow-[0_8px_24px_-14px_rgba(99,102,241,0.65)]"
                      : "border-[var(--border)] bg-[var(--surface)]/50 hover:border-[var(--accent)]/35 hover:bg-[var(--accent-soft)]/25",
                  ].join(" ")}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                    {job.period}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-[var(--foreground)]">{job.title}</h3>
                  <p className="text-xs text-[var(--muted)]">{job.company}</p>
                </button>
              </motion.li>
            );
          })}
        </ol>
      </aside>

      <motion.article
        key={active.id}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 p-5 backdrop-blur-md sm:p-6"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--accent)]/10 blur-3xl"
        />
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            {active.period}
          </p>
          <p className="text-xs text-[var(--muted)]">{active.location}</p>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">{active.title}</h3>
        <p className="text-sm text-[var(--muted)]">{active.company}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
          {active.bullets.map((b) => (
            <li key={b} className="flex gap-2 leading-relaxed">
              <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]/60" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {active.stack.split(",").map((tech) => (
            <span
              key={tech.trim()}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]"
            >
              {tech.trim()}
            </span>
          ))}
        </div>

        {active.scrum ? (
          <section
            id="scrum-master"
            aria-labelledby={`${active.id}-scrum-title`}
            className="mt-5 scroll-mt-28 rounded-xl border border-[var(--accent)]/30 bg-[var(--accent-soft)]/50 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4
                id={`${active.id}-scrum-title`}
                className="text-sm font-semibold text-[var(--foreground)]"
              >
                {active.scrum.title}
              </h4>
              <p className="text-xs font-medium text-[var(--accent)]">{active.scrum.period}</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{active.scrum.intro}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
              {active.scrum.bullets.map((b) => (
                <li key={b} className="flex gap-2 leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </motion.article>
    </div>
  );
}
