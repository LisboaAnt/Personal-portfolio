"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  title: string;
  body: string;
  email: string;
  github: { href: string; label: string };
  linkedin: { href: string; label: string };
};

export function ContactSection({ title, body, email, github, linkedin }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface-elevated)]/90 via-[var(--surface-elevated)]/70 to-[var(--accent-soft)]/30 p-7 backdrop-blur-md sm:p-10"
      aria-labelledby="contact-heading"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--accent)]/15 blur-[120px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-[120px]"
      />

      <div className="relative">
        <h2
          id="contact-heading"
          className="bg-gradient-to-br from-[var(--foreground)] to-[var(--accent)] bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl"
        >
          {title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">{body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_-5px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.7)]"
          >
            <span>{email}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href={github.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-5 py-2.5 text-sm font-medium text-[var(--foreground)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]"
          >
            {github.label}
          </a>
          <a
            href={linkedin.href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-5 py-2.5 text-sm font-medium text-[var(--foreground)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-soft)]"
          >
            {linkedin.label}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
