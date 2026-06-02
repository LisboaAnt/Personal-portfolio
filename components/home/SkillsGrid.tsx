"use client";

import { motion, useReducedMotion } from "framer-motion";

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export function SkillsGrid({ groups }: { groups: SkillGroup[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {groups.map((g, groupIndex) => (
        <motion.div
          key={g.id}
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.6, delay: groupIndex * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 p-5 backdrop-blur-md transition-all duration-500 hover:border-[var(--accent)]/40"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[var(--accent)]/10 blur-2xl transition-opacity duration-500 group-hover:bg-[var(--accent)]/20"
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
            {g.label}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {g.items.map((item, i) => (
              <motion.li
                key={item}
                initial={reduced ? false : { opacity: 0, scale: 0.85 }}
                whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{
                  duration: 0.35,
                  delay: groupIndex * 0.1 + i * 0.03,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <span className="inline-block cursor-default rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
