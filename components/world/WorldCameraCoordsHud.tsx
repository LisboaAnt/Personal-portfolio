"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useWorldQuality } from "@/hooks/useWorldQuality";
import { useWorldCameraDebugStore } from "@/stores/world-camera-debug-store";
import { useWorldCameraInputStore } from "@/stores/world-camera-input-store";
import {
  perfStatus,
  qualityLevel,
  triangleStatus,
  useWorldPerfStore,
  WORLD_TRIANGLE_BUDGET,
} from "@/stores/world-perf-store";
import { useWorldStore } from "@/stores/world-store";
import { useWorldEducationQualityStore } from "@/stores/world-education-quality-store";
import {
  WORLD_CAMERA_MOVE_SPEED_DEFAULT,
  WORLD_CAMERA_MOVE_SPEED_MAX,
  WORLD_CAMERA_MOVE_SPEED_MIN,
  WORLD_CAMERA_MOVE_SPEED_STEP,
  WORLD_EDUCATION_QUALITY_BOOST_MAX,
} from "@/world/constants";

const HUD_MINIMIZED_KEY = "portfolio-hud-minimized";

function fmt([x, y, z]: [number, number, number]) {
  return `X ${x}  ·  Y ${y}  ·  Z ${z}`;
}

function statusClass(status: "ok" | "warn" | "bad") {
  if (status === "ok") return "text-emerald-600 dark:text-emerald-400";
  if (status === "warn") return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function WorldCameraCoordsHud() {
  const t = useTranslations("World.hud");
  const { position, target, rotationDeg, fov } = useWorldCameraDebugStore();
  const shiftMouse = useWorldCameraInputStore((s) => s.shiftMouse);
  const freeCameraEnabled = useWorldCameraInputStore((s) => s.freeCameraEnabled);
  const setFreeCameraEnabled = useWorldCameraInputStore((s) => s.setFreeCameraEnabled);
  const moveSpeed = useWorldCameraInputStore((s) => s.moveSpeed);
  const adjustMoveSpeed = useWorldCameraInputStore((s) => s.adjustMoveSpeed);
  const setMoveSpeed = useWorldCameraInputStore((s) => s.setMoveSpeed);
  const hydrateMoveSpeed = useWorldCameraInputStore((s) => s.hydrateMoveSpeed);
  const hydrateFreeCamera = useWorldCameraInputStore((s) => s.hydrateFreeCamera);
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const educationBoost = useWorldEducationQualityStore((s) => s.boost);
  const quality = useWorldQuality();
  const { fps, frameMs, triangles, drawCalls, geometries, textures } = useWorldPerfStore();
  const [minimized, setMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  const qualityLabel =
    qualityLevel(quality) === "high"
      ? educationBoost > 0
        ? `${t("qualityHigh")}+${educationBoost}/${WORLD_EDUCATION_QUALITY_BOOST_MAX}`
        : t("qualityHigh")
      : t("qualityLow");

  useEffect(() => {
    try {
      setMinimized(localStorage.getItem(HUD_MINIMIZED_KEY) === "1");
    } catch {
      /* ignore */
    }
    hydrateMoveSpeed();
    hydrateFreeCamera();
    queueMicrotask(() => setMounted(true));
  }, [hydrateFreeCamera, hydrateMoveSpeed]);

  const toggleMinimized = () => {
    setMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(HUD_MINIMIZED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const moveSpeedPct = Math.round(moveSpeed * 100);
  const atMinSpeed = moveSpeed <= WORLD_CAMERA_MOVE_SPEED_MIN + 1e-6;
  const atMaxSpeed = moveSpeed >= WORLD_CAMERA_MOVE_SPEED_MAX - 1e-6;
  const atDefaultSpeed = Math.abs(moveSpeed - WORLD_CAMERA_MOVE_SPEED_DEFAULT) < 1e-6;

  const speedBtnClass =
    "rounded border border-[var(--border)] px-1.5 py-0.5 font-sans text-[9px] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40";
  const fpsSt = perfStatus(fps);
  const triSt = triangleStatus(triangles);

  const panelClass = `pointer-events-auto max-w-[min(100%,20rem)] rounded-lg border font-mono text-[10px] leading-relaxed shadow-lg backdrop-blur-md sm:max-w-xs sm:text-xs ${
    freeCameraEnabled && shiftMouse
      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
      : "border-[var(--border)] bg-[var(--surface)]/90 text-[var(--foreground)]"
  }`;

  return (
    <div
      className="fixed inset-x-0 top-14 z-[60] px-4 sm:top-16 sm:px-6"
      aria-live="polite"
      aria-label={t("aria")}
    >
      <div className="mx-auto flex max-w-5xl justify-start">
        {!mounted ? null : minimized ? (
          <div className={`${panelClass} flex items-center gap-2 px-2 py-1.5`}>
            <span className="text-[var(--muted)]">FPS</span>
            <span className={statusClass(fpsSt)}>{fps || "—"}</span>
            <button
              type="button"
              onClick={toggleMinimized}
              className="ml-1 rounded border border-[var(--border)] px-1.5 py-0.5 font-sans text-[9px] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              aria-expanded={false}
              aria-label={t("expand")}
              title={t("expand")}
            >
              +
            </button>
          </div>
        ) : (
          <div className={`${panelClass} px-3 py-2`}>
            <div className="mb-1.5 flex items-center justify-between gap-2 border-b border-[var(--border)] pb-1.5">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-wide text-[var(--muted)] sm:text-[10px]">
                Debug 3D
              </span>
              <button
                type="button"
                onClick={toggleMinimized}
                className="rounded border border-[var(--border)] px-1.5 py-0.5 font-sans text-[9px] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                aria-expanded={true}
                aria-label={t("minimize")}
                title={t("minimize")}
              >
                −
              </button>
            </div>
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-1.5 font-sans text-[9px] sm:text-[10px]">
              <span className="text-[var(--muted)]">{t("freeCamera")}</span>
              <button
                type="button"
                onClick={() => setFreeCameraEnabled(!freeCameraEnabled)}
                aria-pressed={freeCameraEnabled}
                className={[
                  "rounded-full border px-2.5 py-0.5 font-sans text-[9px] font-medium transition",
                  freeCameraEnabled
                    ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)]",
                ].join(" ")}
              >
                {freeCameraEnabled ? t("freeCameraOn") : t("freeCameraOff")}
              </button>
            </div>
            <p className="mb-1.5 border-b border-[var(--border)] pb-1.5 text-[9px] font-sans sm:text-[10px]">
              {freeCameraEnabled ? t("controlsFree") : t("controlsScripted")}
            </p>
            <div
              className={[
                "mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-[var(--border)] pb-1.5 font-sans text-[9px] sm:text-[10px]",
                freeCameraEnabled ? "" : "opacity-45",
              ].join(" ")}
            >
              <span className="text-[var(--muted)]">{t("moveSpeed")}</span>
              <span className="inline-flex items-center gap-1">
                <button
                  type="button"
                  className={speedBtnClass}
                  disabled={!freeCameraEnabled || atMinSpeed}
                  onClick={() => adjustMoveSpeed(-WORLD_CAMERA_MOVE_SPEED_STEP)}
                  aria-label={t("moveSpeedDown")}
                  title={t("moveSpeedDown")}
                >
                  −
                </button>
                <span aria-live="polite">{moveSpeedPct}%</span>
                <button
                  type="button"
                  className={speedBtnClass}
                  disabled={!freeCameraEnabled || atMaxSpeed}
                  onClick={() => adjustMoveSpeed(WORLD_CAMERA_MOVE_SPEED_STEP)}
                  aria-label={t("moveSpeedUp")}
                  title={t("moveSpeedUp")}
                >
                  +
                </button>
                <button
                  type="button"
                  className={speedBtnClass}
                  disabled={!freeCameraEnabled || atDefaultSpeed}
                  onClick={() => setMoveSpeed(WORLD_CAMERA_MOVE_SPEED_DEFAULT)}
                  aria-label={t("moveSpeedReset")}
                  title={t("moveSpeedReset")}
                >
                  {t("moveSpeedResetShort")}
                </button>
              </span>
            </div>
            <p className="mb-1.5 border-b border-[var(--border)] pb-1.5">
              <span className="text-[var(--muted)]">FPS</span>{" "}
              <span className={statusClass(fpsSt)}>{fps || "—"}</span>
              <span className="text-[var(--muted)]"> · {t("frame")}</span>{" "}
              {frameMs ? `${frameMs.toFixed(1)} ms` : "—"}
              <span className="text-[var(--muted)]"> · {t("triangles")}</span>{" "}
              <span className={statusClass(triSt)}>{triangles ? triangles.toLocaleString() : "—"}</span>
              <span className="text-[var(--muted)]"> / {WORLD_TRIANGLE_BUDGET.toLocaleString()}</span>
              <span className="text-[var(--muted)]"> · {t("draws")}</span> {drawCalls || "—"}
              <span className="text-[var(--muted)]"> · {t("geo")}</span> {geometries || "—"}
              <span className="text-[var(--muted)]"> · {t("tex")}</span> {textures || "—"}
              <span className="text-[var(--muted)]"> · {t("profile")}</span> {qualityLabel}
              <span className="text-[var(--muted)]"> · {t("section")}</span> {focusRoomId}
              <span className="text-[var(--muted)]"> · {t("render")}</span> always
            </p>
            <p>
              <span className="text-[var(--muted)]">{t("position")}</span> {fmt(position)}
            </p>
            <p>
              <span className="text-[var(--muted)]">{t("target")}</span> {fmt(target)}
            </p>
            <p>
              <span className="text-[var(--muted)]">{t("rotation")}</span> {fmt(rotationDeg)}
              <span className="text-[var(--muted)]"> · FOV</span> {fov}
            </p>
            <p className="mt-1.5 border-t border-[var(--border)] pt-1.5 text-[9px] leading-snug text-[var(--muted)] font-sans sm:text-[10px]">
              {t("poseHint")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
