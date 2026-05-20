"use client";

import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import { useWebGLAvailable } from "@/hooks/useWebGLAvailable";

const WorldCanvas = dynamic(
  () => import("./WorldCanvas").then((m) => m.WorldCanvas),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-[var(--surface)]" /> }
);

type Props = {
  backLabel: string;
  title: string;
  intro: string;
  hint: string;
  fallbackTitle: string;
  fallbackBody: string;
  classicLabel: string;
};

export function WorldLabShell({
  backLabel,
  title,
  intro,
  hint,
  fallbackTitle,
  fallbackBody,
  classicLabel,
}: Props) {
  const webgl = useWebGLAvailable();

  if (webgl === false) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">{fallbackTitle}</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">{fallbackBody}</p>
        <Link
          href="/lab"
          className="mt-6 inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {classicLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100dvh-4rem)] min-h-[480px] w-full overflow-hidden">
      {webgl === null ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface)] text-sm text-[var(--muted)]">
          …
        </div>
      ) : (
        <WorldCanvas className="absolute inset-0" scene="spike" />
      )}

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
        <div className="pointer-events-auto">
          <Link
            href="/lab"
            className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] backdrop-blur-md hover:border-[var(--accent)]/40"
          >
            ← {backLabel}
          </Link>
        </div>
        <div className="pointer-events-none mx-auto max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)]/75 p-4 text-center backdrop-blur-md">
          <h1 className="text-lg font-semibold text-[var(--foreground)]">{title}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{intro}</p>
          <p className="mt-3 text-xs text-[var(--accent)]">{hint}</p>
        </div>
      </div>
    </div>
  );
}
