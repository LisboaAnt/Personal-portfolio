"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const LINE = "npx next dev";

export function FakeTerminal() {
  const t = useTranslations("Lab.terminal");
  const [shown, setShown] = useState("");

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(LINE.slice(0, i));
      if (i >= LINE.length) window.clearInterval(id);
    }, 90);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="rounded-xl border border-[var(--border)] bg-[#0d1117] p-4 font-mono text-sm text-slate-200 shadow-inner"
      aria-hidden
    >
      <div className="mb-2 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
      </div>
      <p className="text-[11px] text-slate-500">{t("title")}</p>
      <p className="mt-2">
        <span className="text-emerald-400">➜</span> <span className="text-sky-400">~</span>{" "}
        <span className="text-slate-300">{shown}</span>
        <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-slate-400" />
      </p>
    </div>
  );
}
