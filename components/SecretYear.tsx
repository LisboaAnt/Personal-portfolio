"use client";

import { useCallback, useState } from "react";

const NEED = 10;

export function SecretYear({ label }: { label: string }) {
  const [n, setN] = useState(0);

  const onClick = useCallback(() => {
    const next = n + 1;
    setN(next);
    if (next >= NEED) {
      setN(0);
      window.dispatchEvent(new CustomEvent("portfolio:year-secret"));
    }
  }, [n]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-default border-none bg-transparent p-0 font-medium text-[var(--muted)] underline decoration-dotted decoration-[var(--border)] underline-offset-4 hover:text-[var(--foreground)]"
      aria-label={label}
    >
      2026
    </button>
  );
}
