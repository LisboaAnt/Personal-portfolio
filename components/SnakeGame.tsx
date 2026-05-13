"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COLS = 14;
const ROWS = 12;
const INITIAL = [
  { x: 4, y: 6 },
  { x: 3, y: 6 },
  { x: 2, y: 6 },
];

type Cell = { x: number; y: number };

function randomFood(snake: Cell[]): Cell {
  for (let i = 0; i < 400; i++) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if (!snake.some((s) => s.x === x && s.y === y)) return { x, y };
  }
  return { x: 0, y: 0 };
}

type Props = {
  title: string;
  scoreLabel: string;
  controls: string;
  closeLabel: string;
  gameOverLabel: string;
  onClose: () => void;
};

export function SnakeGame({
  title,
  scoreLabel,
  controls,
  closeLabel,
  gameOverLabel,
  onClose,
}: Props) {
  const [snake, setSnake] = useState<Cell[]>(INITIAL);
  const [food, setFood] = useState<Cell>(() => randomFood(INITIAL));
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 1, y: 0 });
  const dirRef = useRef(dir);
  const [alive, setAlive] = useState(true);
  const [score, setScore] = useState(0);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);

  const reset = useCallback(() => {
    const s = [...INITIAL];
    setSnake(s);
    setFood(randomFood(s));
    setDir({ x: 1, y: 0 });
    setAlive(true);
    setScore(0);
  }, []);

  useEffect(() => {
    if (!alive) return;
    const id = window.setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const d = dirRef.current;
        const nx = head.x + d.x;
        const ny = head.y + d.y;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
          setAlive(false);
          return prev;
        }
        const bite = prev.some((c) => c.x === nx && c.y === ny);
        if (bite) {
          setAlive(false);
          return prev;
        }
        const newHead = { x: nx, y: ny };
        const eating = nx === food.x && ny === food.y;
        const next = eating ? [newHead, ...prev] : [newHead, ...prev.slice(0, -1)];
        if (eating) {
          setFood(randomFood(next));
          setScore((sc) => sc + 1);
        }
        return next;
      });
    }, 130);
    tickRef.current = id;
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [alive, food.x, food.y]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const d = dirRef.current;
      if (e.code === "ArrowUp" && d.y !== 1) setDir({ x: 0, y: -1 });
      if (e.code === "ArrowDown" && d.y !== -1) setDir({ x: 0, y: 1 });
      if (e.code === "ArrowLeft" && d.x !== 1) setDir({ x: -1, y: 0 });
      if (e.code === "ArrowRight" && d.x !== -1) setDir({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-elevated)]"
          >
            {closeLabel}
          </button>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">{controls}</p>
        <p className="mt-2 text-sm font-medium text-[var(--accent)]">
          {scoreLabel}: {score}
        </p>
        <div
          className="mt-3 grid gap-px rounded-lg border border-[var(--border)] bg-[var(--border)] p-px"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: ROWS }, (_, y) =>
            Array.from({ length: COLS }, (_, x) => {
              const onSnake = snake.some((s) => s.x === x && s.y === y);
              const isHead = snake[0]?.x === x && snake[0]?.y === y;
              const isFood = food.x === x && food.y === y;
              return (
                <div
                  key={`${x}-${y}`}
                  className={`aspect-square rounded-[1px] ${
                    isFood
                      ? "bg-amber-400"
                      : onSnake
                        ? isHead
                          ? "bg-indigo-500"
                          : "bg-indigo-400/80"
                        : "bg-[var(--surface-elevated)]"
                  }`}
                />
              );
            }),
          ).flat()}
        </div>
        {!alive ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="text-sm text-rose-400">{gameOverLabel}</p>
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-medium text-white"
            >
              ↻
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
