"use client";

import { useWorldQuality } from "@/hooks/useWorldQuality";
import { useWorldCameraDebugStore } from "@/stores/world-camera-debug-store";
import { useWorldCameraInputStore } from "@/stores/world-camera-input-store";
import {
  perfStatus,
  qualityLabel,
  triangleStatus,
  useWorldPerfStore,
  WORLD_TRIANGLE_BUDGET,
} from "@/stores/world-perf-store";
import { useWorldStore } from "@/stores/world-store";

function fmt([x, y, z]: [number, number, number]) {
  return `X ${x}  ·  Y ${y}  ·  Z ${z}`;
}

function statusClass(status: "ok" | "warn" | "bad") {
  if (status === "ok") return "text-emerald-600 dark:text-emerald-400";
  if (status === "warn") return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function WorldCameraCoordsHud() {
  const { position, target, rotationDeg, fov } = useWorldCameraDebugStore();
  const shiftMouse = useWorldCameraInputStore((s) => s.shiftMouse);
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const quality = useWorldQuality();
  const { fps, frameMs, triangles, drawCalls, geometries, textures } = useWorldPerfStore();

  const fpsSt = perfStatus(fps);
  const triSt = triangleStatus(triangles);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-14 z-[60] flex justify-center px-3 sm:top-16"
      aria-live="polite"
      aria-label="Coordenadas e desempenho da câmara 3D"
    >
      <div
        className={`max-w-[min(100%,52rem)] rounded-lg border px-3 py-2 font-mono text-[10px] leading-relaxed shadow-lg backdrop-blur-md sm:text-xs ${
          shiftMouse
            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
            : "border-[var(--border)] bg-[var(--surface)]/90 text-[var(--foreground)]"
        }`}
      >
        <p className="mb-1.5 border-b border-[var(--border)] pb-1.5 text-[9px] font-sans sm:text-[10px]">
          <span className="text-[var(--muted)]">WASD</span> + Q/E mover ·{" "}
          <span className="text-[var(--muted)]">Shift</span> + rato = olhar/deslizar · Shift + roda =
          zoom · Shift/Alt = rápido
        </p>
        <p className="mb-1.5 border-b border-[var(--border)] pb-1.5">
          <span className="text-[var(--muted)]">FPS</span>{" "}
          <span className={statusClass(fpsSt)}>{fps || "—"}</span>
          <span className="text-[var(--muted)]"> · frame</span> {frameMs ? `${frameMs.toFixed(1)} ms` : "—"}
          <span className="text-[var(--muted)]"> · triângulos</span>{" "}
          <span className={statusClass(triSt)}>{triangles ? triangles.toLocaleString() : "—"}</span>
          <span className="text-[var(--muted)]"> / {WORLD_TRIANGLE_BUDGET.toLocaleString()}</span>
          <span className="text-[var(--muted)]"> · draws</span> {drawCalls || "—"}
          <span className="text-[var(--muted)]"> · geo</span> {geometries || "—"}
          <span className="text-[var(--muted)]"> · tex</span> {textures || "—"}
          <span className="text-[var(--muted)]"> · perfil</span> {qualityLabel(quality)}
          <span className="text-[var(--muted)]"> · secção</span> {focusRoomId}
          <span className="text-[var(--muted)]"> · render</span> always
        </p>
        <p>
          <span className="text-[var(--muted)]">Posição</span> {fmt(position)}
        </p>
        <p>
          <span className="text-[var(--muted)]">Alvo</span> {fmt(target)}
        </p>
        <p>
          <span className="text-[var(--muted)]">Rotação°</span> {fmt(rotationDeg)}
          <span className="text-[var(--muted)]"> · FOV</span> {fov}
        </p>
      </div>
    </div>
  );
}
