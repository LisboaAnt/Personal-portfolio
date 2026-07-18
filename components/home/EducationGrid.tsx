"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  EDUCATION_BACHELOR_CARD_ID,
  useWorldEducationStore,
} from "@/stores/world-education-store";
import { EducationDetailModal } from "./EducationDetailModal";

export type EducationTopic = {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
};

export type EducationGalleryPhoto = {
  src: string;
  alt: string;
};

export type EducationItem = {
  id: string;
  period: string;
  title: string;
  institution: string;
  meta: string;
  bullets: string[];
  summary?: string;
  topics?: EducationTopic[];
  gallery?: EducationGalleryPhoto[];
};

/** Bacharelado sempre ao centro; restantes por ordem cronológica. */
const EDUCATION_DISPLAY_ORDER = ["senai", EDUCATION_BACHELOR_CARD_ID, "ufc-mentor"] as const;

function sortEducationItems(items: EducationItem[]): EducationItem[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return EDUCATION_DISPLAY_ORDER.map((id) => byId.get(id)).filter(
    (item): item is EducationItem => item != null,
  );
}

type Props = {
  items: EducationItem[];
};

export function EducationGrid({ items }: Props) {
  const ordered = useMemo(() => sortEducationItems(items), [items]);
  const t = useTranslations("Home.education");
  const setActiveCard = useWorldEducationStore((s) => s.setActiveCard);
  const [openId, setOpenId] = useState<string | null>(null);

  const openItem = ordered.find((edu) => edu.id === openId) ?? null;

  const handleOpen = (id: string) => {
    setOpenId(id);
    setActiveCard(id);
  };

  const handleClose = () => {
    setOpenId(null);
    setActiveCard(null);
  };

  return (
    <>
      <div className="education-zones mx-auto grid w-full max-w-5xl grid-cols-1 items-stretch gap-2.5 sm:grid-cols-3 sm:items-start sm:gap-2">
        {ordered.map((edu) => {
          const featured = edu.id === EDUCATION_BACHELOR_CARD_ID;

          return (
            <div key={edu.id} className="min-w-0">
              <button
                type="button"
                onClick={() => handleOpen(edu.id)}
                aria-haspopup="dialog"
                aria-label={`${t("openDetails")}: ${edu.title} — ${edu.institution}`}
                className={[
                  "education-zone group flex w-full flex-col items-start gap-1.5 px-3.5 py-3.5 text-left sm:items-center sm:gap-1.5 sm:px-3 sm:py-4 sm:text-center",
                  featured ? "education-zone--featured" : "",
                ].join(" ")}
              >
                <span className="education-zone__period text-[11px] font-semibold uppercase tracking-[0.14em] sm:text-[11px]">
                  {edu.period}
                </span>
                <span
                  className={[
                    "education-zone__title leading-snug",
                    featured ? "text-base sm:text-base" : "text-[0.9375rem] sm:text-sm",
                  ].join(" ")}
                >
                  {edu.title}
                </span>
                <span className="education-zone__institution text-[11px] leading-snug sm:text-[11px]">
                  {edu.institution}
                </span>
                {edu.meta ? (
                  <span className="education-zone__meta sm:hidden">{edu.meta}</span>
                ) : null}
              </button>
            </div>
          );
        })}
      </div>

      <EducationDetailModal
        item={openItem}
        labels={{
          close: t("close"),
          topicsHeading: t("topicsHeading"),
          highlightsHeading: t("highlightsHeading"),
        }}
        onClose={handleClose}
      />
    </>
  );
}
