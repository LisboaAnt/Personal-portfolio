"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SnakeGame } from "@/components/SnakeGame";
import { useWorldStore } from "@/stores/world-store";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
] as const;

export function EasterEggHost() {
  const t = useTranslations("Easter");
  const setWorldPaused = useWorldStore((s) => s.setPaused);
  const bufRef = useRef<string[]>([]);
  const [snake, setSnake] = useState(false);
  const [yearToast, setYearToast] = useState(false);

  useEffect(() => {
    setWorldPaused(snake);
    return () => setWorldPaused(false);
  }, [snake, setWorldPaused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      const next = [...bufRef.current, e.code].slice(-10);
      bufRef.current = next;
      if (next.length === 10 && KONAMI.every((code, i) => next[i] === code)) {
        setSnake(true);
        bufRef.current = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onYear = () => setYearToast(true);
    window.addEventListener("portfolio:year-secret", onYear);
    return () => window.removeEventListener("portfolio:year-secret", onYear);
  }, []);

  return (
    <>
      {snake ? (
        <SnakeGame
          title={t("snakeTitle")}
          scoreLabel={t("snakeScore")}
          controls={t("snakeControls")}
          closeLabel={t("close")}
          gameOverLabel={t("snakeOver")}
          onClose={() => setSnake(false)}
        />
      ) : null}
      {yearToast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[90] max-w-sm -translate-x-1/2 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-4 py-3 text-center text-sm text-[var(--foreground)] shadow-xl"
          role="status"
        >
          <p>{t("yearToast")}</p>
          <button
            type="button"
            className="mt-2 text-xs font-medium text-[var(--accent)] underline"
            onClick={() => setYearToast(false)}
          >
            {t("close")}
          </button>
        </div>
      ) : null}
    </>
  );
}
