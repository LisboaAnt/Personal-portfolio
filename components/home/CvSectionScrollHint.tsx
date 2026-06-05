"use client";

import { motion, useReducedMotion } from "framer-motion";
import { scrollToCvSection } from "@/lib/cv-scroll";
import { useWorldStore } from "@/stores/world-store";
import type { CvSectionId } from "@/world/types";

type Props = {
  targetSection: CvSectionId;
  ariaLabel: string;
  className?: string;
};

export function CvSectionScrollHint({ targetSection, ariaLabel, className }: Props) {
  const reduced = useReducedMotion();
  const setFocusRoom = useWorldStore((s) => s.setFocusRoom);

  const goToSection = () => {
    setFocusRoom(targetSection);
    scrollToCvSection(targetSection, reduced ? "auto" : "smooth");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${window.location.pathname}#${targetSection}`);
    }
  };

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={reduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <button
        type="button"
        onClick={goToSection}
        className={[
          "site-chip-btn hero-scroll-hint pointer-events-auto",
          reduced ? "" : "hero-scroll-hint--animate",
        ].join(" ")}
        aria-label={ariaLabel}
      >
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </button>
    </motion.div>
  );
}
