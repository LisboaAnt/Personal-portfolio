"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
};

export function ProjectTiltVisual({ src, alt }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ rx: 0, ry: 0 });

  if (!src?.trim()) {
    return (
      <div
        className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/60 sm:h-44"
        aria-hidden
      />
    );
  }

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setRot({ rx: py * -10, ry: px * 14 });
  }, []);

  const onLeave = useCallback(() => setRot({ rx: 0, ry: 0 }), []);

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="perspective-[1000px] motion-reduce:perspective-none"
    >
      <div
        className="transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none [transform-style:preserve-3d]"
        style={{
          transform: `rotateX(${rot.rx}deg) rotateY(${rot.ry}deg)`,
        }}
      >
        <div className="proj-float-inner relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-inner">
          <Image
            src={src}
            alt={alt}
            width={800}
            height={480}
            className="h-40 w-full object-cover sm:h-44"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface)]/90 via-transparent to-white/5 dark:to-white/10"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
