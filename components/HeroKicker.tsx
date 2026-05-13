"use client";

import { useState } from "react";

type Props = {
  children: React.ReactNode;
  threshold: number;
  toast: string;
  ariaLabel: string;
};

export function HeroKicker({ children, threshold, toast, ariaLabel }: Props) {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => {
          const n = count + 1;
          setCount(n);
          if (n >= threshold) setOpen(true);
        }}
        className="cursor-default border-none bg-transparent p-0 text-left font-semibold uppercase tracking-[0.2em] text-[var(--accent)] outline-none ring-[var(--accent)]/40 transition hover:opacity-90 focus-visible:ring-2"
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {open ? (
        <div
          className="absolute left-0 top-full z-30 mt-2 max-w-xs rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-xs leading-relaxed text-[var(--foreground)] shadow-lg"
          role="status"
        >
          <p>{toast}</p>
          <button
            type="button"
            className="mt-2 text-[11px] font-medium text-[var(--accent)] underline"
            onClick={() => setOpen(false)}
          >
            OK
          </button>
        </div>
      ) : null}
    </div>
  );
}
