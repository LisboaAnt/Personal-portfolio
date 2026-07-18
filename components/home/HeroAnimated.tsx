"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { isHeroFastEnter } from "@/lib/hero-enter";
import { HeroRotatingHeadline } from "@/components/home/HeroRotatingHeadline";
import { CvSectionScrollHint } from "@/components/home/CvSectionScrollHint";

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
  const motionInitial = reduced || fastEnter ? false : { opacity: 0, y: 10 };

  const headlinePhrasesForViewport = useMemo(
    () =>
      isMobile ? headlinePhrases.slice(0, MOBILE_HEADLINE_PHRASE_COUNT) : headlinePhrases,
    [headlinePhrases, isMobile],
  );

  return (
    <header
      id="profile"
      data-world-room="profile"
      lang={locale}
      translate="no"
      className="hero-notranslate cv-snap-section cv-snap-section--hero relative flex scroll-mt-24 flex-col overflow-hidden"
    >
      <motion.p
        initial={motionInitial}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="hero-desktop-hint"
        role="note"
      >
        {t("desktopHint")}
      </motion.p>

      <div className="cv-snap-section__inner relative z-10 flex min-h-0 flex-1 flex-col justify-start sm:justify-center">
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
          className="hero-headline-slot mt-0.5 sm:mt-1.5"
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
          className="hero-bio-slot"
        >
          {bio}
        </motion.div>
      </div>

      <CvSectionScrollHint
        targetSection="experience"
        ariaLabel={t("scrollToExperience")}
        className="relative z-10 mt-auto flex shrink-0 justify-center pb-16 pt-4 sm:pb-20 sm:pt-6 lg:pb-24 lg:pt-8"
      />
    </header>
  );
}
