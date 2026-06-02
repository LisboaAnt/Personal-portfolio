"use client";

import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";

export type EducationItem = {
  id: string;
  period: string;
  title: string;
  institution: string;
  meta: string;
  bullets: string[];
};

export function EducationGrid({ items }: { items: EducationItem[] }) {
  return (
    <MotionStagger className="grid gap-4 md:grid-cols-3">
      {items.map((edu) => (
        <MotionStaggerItem key={edu.id}>
          <article className="group relative h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-[0_18px_40px_-12px_rgba(99,102,241,0.4)]">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              {edu.period}
            </p>
            <h3 className="mt-2 text-base font-semibold leading-snug text-[var(--foreground)]">
              {edu.title}
            </h3>
            <p className="mt-1 text-sm text-[var(--muted)]">{edu.institution}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
              {edu.meta}
            </p>
            {edu.bullets.length ? (
              <ul className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
                {edu.bullets.map((b) => (
                  <li key={b} className="flex gap-2 leading-relaxed">
                    <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        </MotionStaggerItem>
      ))}
    </MotionStagger>
  );
}
