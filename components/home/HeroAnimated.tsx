"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { isHeroFastEnter } from "@/lib/hero-enter";
import { scrollToCvSection } from "@/lib/cv-scroll";
import { useWorldStore } from "@/stores/world-store";
import { HeroRotatingHeadline } from "@/components/home/HeroRotatingHeadline";

const MOBILE_HEADLINE_PHRASE_COUNT = 6;

type Props = {
  intro: string;
  headlinePrefix: string;
  headlinePhrases: string[];
  headlineAria: string;
  name: string;
  bio: ReactNode;
};

export function HeroAnimated({
  intro,
  headlinePrefix,
  headlinePhrases,
  headlineAria,
  name,
  bio,
}: Props) {
  const locale = useLocale();
  const t = useTranslations("Home.hero");
  const reduced = useReducedMotion();
  const fastEnter = isHeroFastEnter();
  const isMobile = useIsMobile();
  const setFocusRoom = useWorldStore((s) => s.setFocusRoom);
  const motionInitial = reduced || fastEnter ? false : { opacity: 0, y: 10 };

  const headlinePhrasesForViewport = useMemo(
    () =>
      isMobile ? headlinePhrases.slice(0, MOBILE_HEADLINE_PHRASE_COUNT) : headlinePhrases,
    [headlinePhrases, isMobile],
  );

  const goToExperience = () => {
    setFocusRoom("experience");
    scrollToCvSection("experience", reduced ? "auto" : "smooth");
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `${window.location.pathname}#experience`);
    }
  };

  return (
    <header
      id="profile"
      data-world-room="profile"
      lang={locale}
      translate="no"
      className="hero-notranslate cv-snap-section cv-snap-section--hero relative flex scroll-mt-24 flex-col overflow-hidden"
    >
      <div className="cv-snap-section__inner relative z-10 flex min-h-0 flex-1 flex-col justify-center">
        <motion.p
          initial={motionInitial}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hero-kicker"
        >
          {intro}
        </motion.p>

        <motion.div
          initial={motionInitial}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: fastEnter ? 0 : 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mt-0.5 sm:mt-1.5"
        >
          <HeroRotatingHeadline
            prefix={headlinePrefix}
            phrases={headlinePhrasesForViewport}
            ariaLabel={`${name}. ${headlineAria}`}
          />
        </motion.div>

        <motion.div
          initial={motionInitial}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: fastEnter ? 0 : 0.14, ease: [0.22, 1, 0.36, 1] }}
        >
          {bio}
        </motion.div>
      </div>

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: fastEnter ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-auto flex shrink-0 justify-center pb-16 pt-4 sm:pb-20 sm:pt-6 lg:pb-24 lg:pt-8"
      >
        <button
          type="button"
          onClick={goToExperience}
          className={[
            "site-chip-btn hero-scroll-hint",
            reduced ? "" : "hero-scroll-hint--animate",
          ].join(" ")}
          aria-label={t("scrollToExperience")}
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
    </header>
  );
}
