"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  id?: string;
  kicker?: string;
  title: string;
};

export function SectionTitle({ id, kicker, title }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {kicker ? (
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]"
          >
            {kicker}
          </motion.p>
        ) : null}
        <motion.h2
          id={id}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 bg-gradient-to-br from-[var(--foreground)] via-[var(--foreground)] to-[var(--accent)] bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl"
        >
          {title}
        </motion.h2>
      </div>
      <motion.span
        aria-hidden
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "left" }}
        className="hidden h-px flex-1 translate-y-[-0.7rem] bg-gradient-to-r from-[var(--accent)]/50 via-[var(--border)] to-transparent sm:block"
      />
    </div>
  );
}
