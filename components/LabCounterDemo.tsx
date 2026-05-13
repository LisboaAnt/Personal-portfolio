"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { labGreet, type LabGreetState } from "@/app/actions";

export function LabCounterDemo() {
  const t = useTranslations("Lab.action");
  const [state, action, pending] = useActionState(labGreet, null as LabGreetState);

  return (
    <form action={action} className="space-y-3">
      <label className="block text-xs font-medium text-[var(--muted)]" htmlFor="lab-name">
        {t("label")}
      </label>
      <div className="flex flex-wrap gap-2">
        <input
          id="lab-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t("placeholder")}
          className="min-w-[12rem] flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none ring-[var(--accent)]/30 focus:ring-2"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition enabled:hover:brightness-110 disabled:opacity-60"
        >
          {pending ? t("pending") : t("submit")}
        </button>
      </div>
      {state?.message ? (
        <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)]/80 px-3 py-2 font-mono text-xs text-[var(--muted)]">
          {t("resultPrefix")} {state.message}
        </p>
      ) : null}
    </form>
  );
}
