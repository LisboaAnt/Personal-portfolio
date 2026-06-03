"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import { useMemo, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { isHeroFastEnter } from "@/lib/hero-enter";
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
      className="hero-notranslate relative scroll-mt-24 overflow-hidden"
    >
      <div className="relative z-10 min-w-0">
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
    </header>
  );
}
