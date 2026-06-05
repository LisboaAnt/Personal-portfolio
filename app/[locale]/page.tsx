import { getTranslations, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { HeroAnimated } from "@/components/home/HeroAnimated";
import { HeroBio } from "@/components/home/HeroBio";
import { ExperienceTimeline, type ExperienceItem } from "@/components/home/ExperienceTimeline";
import { ExperienceScrollHint } from "@/components/home/ExperienceScrollHint";
import { EducationGrid, type EducationItem } from "@/components/home/EducationGrid";
import {
  EducationDiplomaCarousel,
  type EducationDiploma,
} from "@/components/home/EducationDiplomaCarousel";
import { SkillsGrid, type SkillGroup } from "@/components/home/SkillsGrid";
import { ProjectsGrid, type ProjectItem } from "@/components/home/ProjectsGrid";
import { ContactSection } from "@/components/home/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionTitle } from "@/components/motion/SectionTitle";
import { MotionReveal } from "@/components/motion/MotionReveal";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const h = await headers();
  const country = h.get("x-vercel-ip-country");
  const acceptLanguage = h.get("accept-language");

  const experience = t.raw("experience.items") as ExperienceItem[];
  const education = t.raw("education.items") as EducationItem[];
  const educationDiplomas = t.raw("education.diplomas.items") as EducationDiploma[];
  const skillGroups = t.raw("skills.groups") as SkillGroup[];
  const projects = t.raw("projects.items") as ProjectItem[];
  const email = t("contact.email");

  return (
    <div className="cv-page-flow mx-auto flex w-full max-w-5xl flex-col gap-14 px-4 pb-20 pt-8 sm:gap-20 sm:px-6 sm:pb-24 sm:pt-12 md:pt-20 lg:gap-28">
      <HeroAnimated
        intro={t("hero.intro")}
        headlinePrefix={t("hero.headlinePrefix")}
        headlinePhrases={t.raw("hero.headlinePhrases") as string[]}
        headlineAria={t("hero.headlineAria")}
        name={t("hero.title")}
        bio={<HeroBio />}
      />

      <section
        id="experience"
        data-world-room="experience"
        className="cv-snap-section experience-section relative scroll-mt-24"
        aria-labelledby="exp-heading"
      >
        <div className="cv-snap-section__inner space-y-8">
          <SectionTitle id="exp-heading" title={t("experience.title")} />
          <ExperienceTimeline items={experience} />
        </div>
        <ExperienceScrollHint />
      </section>

      <section
        id="education"
        data-world-room="education"
        className="cv-snap-section education-section scroll-mt-24"
        aria-labelledby="edu-heading"
      >
        <div className="cv-snap-section__inner education-section__inner space-y-6 sm:space-y-8">
          <SectionTitle id="edu-heading" kicker="02" title={t("education.title")} />
          <EducationGrid items={education} />
        </div>
        <EducationDiplomaCarousel
          title={t("education.diplomas.title")}
          prevLabel={t("education.diplomas.prev")}
          nextLabel={t("education.diplomas.next")}
          items={educationDiplomas}
        />
      </section>

      <section
        id="skills"
        data-world-room="skills"
        className="cv-snap-section scroll-mt-24"
        aria-labelledby="skills-heading"
      >
        <div className="cv-snap-section__inner space-y-8">
          <SectionTitle id="skills-heading" kicker="03" title={t("skills.title")} />
          <SkillsGrid groups={skillGroups} />
        </div>
      </section>

      <section
        id="projects"
        data-world-room="projects"
        className="cv-snap-section scroll-mt-24"
        aria-labelledby="proj-heading"
      >
        <div className="cv-snap-section__inner space-y-8">
          <SectionTitle id="proj-heading" kicker="04" title={t("projects.title")} />
          <ProjectsGrid items={projects} viewCaseLabel={t("projects.viewCase")} />
        </div>
      </section>

      <section
        id="contact"
        data-world-room="contact"
        className="cv-snap-section scroll-mt-24"
        aria-labelledby="contact-heading"
      >
        <div className="cv-snap-section__inner space-y-8">
          <ContactSection
            title={t("contact.title")}
            body={t("contact.body")}
            email={email}
            github={{ href: t("social.github"), label: t("social.githubLabel") }}
            linkedin={{ href: t("social.linkedin"), label: t("social.linkedinLabel") }}
          />

          <MotionReveal>
            <details className="group rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/50 text-sm backdrop-blur-sm">
              <summary className="cursor-pointer list-none px-4 py-3 font-medium text-[var(--muted)] [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-2">
                  {t("detection.summary")}
                  <span className="text-xs text-[var(--muted)] transition group-open:rotate-180">▼</span>
                </span>
              </summary>
              <div
                className="border-t border-[var(--border)] px-4 py-3 text-[var(--muted)]"
                aria-label={t("detection.sectionLabel")}
              >
                <p className="font-medium text-[var(--foreground)]">{t("detection.title")}</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                  <li>{t("detection.pageLocale", { locale })}</li>
                  <li>
                    {t("detection.acceptLanguage", {
                      value: acceptLanguage ?? t("detection.unknown"),
                    })}
                  </li>
                  <li>
                    {t("detection.country", {
                      value: country ?? t("detection.localOnly"),
                    })}
                  </li>
                </ul>
              </div>
            </details>
          </MotionReveal>

          <SiteFooter locale={locale} variant="inline" />
        </div>
      </section>
    </div>
  );
}
