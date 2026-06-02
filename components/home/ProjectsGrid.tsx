"use client";

import { Link } from "@/i18n/navigation";
import { MotionStagger, MotionStaggerItem } from "@/components/motion/MotionStagger";
import { ProjectTiltVisual } from "@/components/ProjectTiltVisual";

export type ProjectItem = {
  id: string;
  title: string;
  role: string;
  description: string;
  stack: string;
  cover: string;
  coverAlt: string;
  bullets?: string[];
};

type Props = {
  items: ProjectItem[];
  viewCaseLabel: string;
};

export function ProjectsGrid({ items, viewCaseLabel }: Props) {
  return (
    <MotionStagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
      {items.map((p) => (
        <MotionStaggerItem key={p.id} distance={24}>
          <article className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--accent)]/40 hover:shadow-[0_20px_50px_-15px_rgba(99,102,241,0.4)]">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <ProjectTiltVisual src={p.cover} alt={p.coverAlt} />
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                {p.role}
              </span>
            </div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">{p.title}</h3>
            <p className="flex-1 text-sm leading-relaxed text-[var(--muted)]">{p.description}</p>
            {p.bullets && p.bullets.length > 0 ? (
              <ul className="space-y-1 text-sm text-[var(--muted)]">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2 leading-relaxed">
                    <span aria-hidden className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-wrap gap-1.5">
              {p.stack.split(",").map((tech) => (
                <span
                  key={tech.trim()}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
            <Link
              href={{ pathname: "/work", hash: p.id }}
              className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] underline-offset-4 transition-all group-hover:gap-2.5 group-hover:underline"
            >
              {viewCaseLabel}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </article>
        </MotionStaggerItem>
      ))}
    </MotionStagger>
  );
}
