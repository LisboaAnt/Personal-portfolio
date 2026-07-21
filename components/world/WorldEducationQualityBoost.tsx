"use client";

import { useEffect, useRef } from "react";
import { useWorldQuality } from "@/hooks/useWorldQuality";
import { useWorldCameraTravelStore } from "@/stores/world-camera-travel-store";
import { useWorldEducationQualityStore } from "@/stores/world-education-quality-store";
import { useWorldEducationStore } from "@/stores/world-education-store";
import { useWorldPerfStore } from "@/stores/world-perf-store";
import { useWorldStore } from "@/stores/world-store";
import {
  WORLD_EDUCATION_BOOST_COOLDOWN_SAMPLES,
  WORLD_EDUCATION_FPS_BOOST_THRESHOLD,
  WORLD_EDUCATION_FPS_DOWNGRADE_THRESHOLD,
  WORLD_EDUCATION_FPS_SAMPLE_STREAK,
  WORLD_EDUCATION_QUALITY_BOOST_MAX,
  WORLD_EDUCATION_ZOOM_FPS_SAMPLES,
  WORLD_EDUCATION_ZOOM_SETTLE_SAMPLES,
} from "@/world/constants";

function armZoomEval(
  pendingZoomEval: { current: boolean },
  settleLeft: { current: number },
  goodSamples: { current: number },
  badStreak: { current: number },
  cooldown: { current: number },
) {
  pendingZoomEval.current = true;
  settleLeft.current = WORLD_EDUCATION_ZOOM_SETTLE_SAMPLES;
  goodSamples.current = 0;
  badStreak.current = 0;
  cooldown.current = 0;
}

/**
 * Education (desktop): qualidade base na vista geral.
 * Depois do zoom num diploma (fim da animação da câmara), mede FPS depressa —
 * se ≥ meta, sobe qualidade (máquinas que só aguentam high com a cena mais perto).
 */
export function WorldEducationQualityBoost() {
  const focusRoomId = useWorldStore((s) => s.focusRoomId);
  const activeCardId = useWorldEducationStore((s) => s.activeCardId);
  const isTraveling = useWorldCameraTravelStore((s) => s.isTraveling);
  const fps = useWorldPerfStore((s) => s.fps);
  const sampleAt = useWorldPerfStore((s) => s.sampleAt);
  const quality = useWorldQuality();
  const boost = useWorldEducationQualityStore((s) => s.boost);
  const setBoost = useWorldEducationQualityStore((s) => s.setBoost);
  const reset = useWorldEducationQualityStore((s) => s.reset);

  const wasTraveling = useRef(false);
  const prevCardId = useRef<string | null>(null);
  const pendingZoomEval = useRef(false);
  const settleLeft = useRef(0);
  const goodSamples = useRef(0);
  const badStreak = useRef(0);
  const cooldown = useRef(0);

  useEffect(() => {
    if (focusRoomId !== "education" || quality !== "high") {
      pendingZoomEval.current = false;
      settleLeft.current = 0;
      goodSamples.current = 0;
      badStreak.current = 0;
      cooldown.current = 0;
      wasTraveling.current = false;
      prevCardId.current = null;
      reset();
      return;
    }

    if (!activeCardId) {
      pendingZoomEval.current = false;
      settleLeft.current = 0;
      goodSamples.current = 0;
      badStreak.current = 0;
      cooldown.current = 0;
      prevCardId.current = null;
      reset();
    }
  }, [activeCardId, focusRoomId, quality, reset]);

  useEffect(() => {
    const cardChanged = prevCardId.current !== activeCardId;
    prevCardId.current = activeCardId;

    const travelEnded = wasTraveling.current && !isTraveling;
    wasTraveling.current = isTraveling;

    if (focusRoomId !== "education" || quality !== "high" || !activeCardId) return;

    if (travelEnded) {
      armZoomEval(pendingZoomEval, settleLeft, goodSamples, badStreak, cooldown);
      return;
    }

    // Zoom sem viagem (pose quase igual) — avalia na mesma.
    if (cardChanged && !isTraveling) {
      armZoomEval(pendingZoomEval, settleLeft, goodSamples, badStreak, cooldown);
    }
  }, [activeCardId, focusRoomId, isTraveling, quality]);

  useEffect(() => {
    if (focusRoomId !== "education" || quality !== "high" || !activeCardId) return;
    if (isTraveling || sampleAt <= 0 || fps <= 0) return;

    if (cooldown.current > 0) {
      cooldown.current -= 1;
      return;
    }

    if (pendingZoomEval.current) {
      if (settleLeft.current > 0) {
        settleLeft.current -= 1;
        return;
      }

      if (fps >= WORLD_EDUCATION_FPS_BOOST_THRESHOLD) {
        goodSamples.current += 1;
        if (goodSamples.current >= WORLD_EDUCATION_ZOOM_FPS_SAMPLES) {
          pendingZoomEval.current = false;
          goodSamples.current = 0;
          if (boost < WORLD_EDUCATION_QUALITY_BOOST_MAX) {
            const next = boost + 1;
            setBoost(next);
            cooldown.current = WORLD_EDUCATION_BOOST_COOLDOWN_SAMPLES;
            if (next < WORLD_EDUCATION_QUALITY_BOOST_MAX) {
              armZoomEval(pendingZoomEval, settleLeft, goodSamples, badStreak, cooldown);
              settleLeft.current = 0;
            }
          }
        }
      } else {
        pendingZoomEval.current = false;
        goodSamples.current = 0;
      }
      return;
    }

    if (fps < WORLD_EDUCATION_FPS_DOWNGRADE_THRESHOLD) {
      badStreak.current += 1;
      if (badStreak.current >= WORLD_EDUCATION_FPS_SAMPLE_STREAK) {
        badStreak.current = 0;
        if (boost > 0) {
          setBoost(boost - 1);
          cooldown.current = WORLD_EDUCATION_BOOST_COOLDOWN_SAMPLES;
        }
      }
      return;
    }

    badStreak.current = 0;
  }, [
    activeCardId,
    boost,
    focusRoomId,
    fps,
    isTraveling,
    quality,
    sampleAt,
    setBoost,
  ]);

  return null;
}
