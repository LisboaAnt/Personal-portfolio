"use client";

import { useTranslations } from "next-intl";
import { CvSectionScrollHint } from "@/components/home/CvSectionScrollHint";

export function ExperienceScrollHint() {
  const t = useTranslations("Home.experience");

  return (
    <CvSectionScrollHint
      targetSection="education"
      ariaLabel={t("scrollToEducation")}
      className="cv-section-scroll-hint cv-section-scroll-hint--experience pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center"
    />
  );
}
