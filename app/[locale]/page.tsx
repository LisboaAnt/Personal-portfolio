import { getTranslations, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { HeroAnimated } from "@/components/home/HeroAnimated";
import { HeroBio } from "@/components/home/HeroBio";
import { ExperienceTimeline, type ExperienceItem } from "@/components/home/ExperienceTimeline";
import { EducationGrid, type EducationItem } from "@/components/home/EducationGrid";
import { SkillsGrid, type SkillGroup } from "@/components/home/SkillsGrid";
import { ProjectsGrid, type ProjectItem } from "@/components/home/ProjectsGrid";
import { ContactSection } from "@/components/home/ContactSection";
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
  const skillGroups = t.raw("skills.groups") as SkillGroup[];
  const projects = t.raw("projects.items") as ProjectItem[];
  const email = t("contact.email");

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-20 px-4 pb-24 pt-12 sm:px-6 sm:pt-20 lg:gap-28">
      <HeroAnimated
        intro={t("hero.intro")}
        headlinePrefix={t("hero.headlinePrefix")}
        headlinePhrases={t.raw("hero.headlinePhrases") as string[]}
        headlineAria={t("hero.headlineAria")}
        name={t("hero.title")}
        bio={<HeroBio />}
      />

      <main id="content" className="flex flex-col gap-20 lg:gap-28">
        <section
          id="experience"
          data-world-room="experience"
          className="scroll-mt-24 space-y-8"
          aria-labelledby="exp-heading"
        >
          <SectionTitle id="exp-heading" kicker="01" title={t("experience.title")} />
          <ExperienceTimeline items={experience} />
        </section>

        <section
          id="education"
          data-world-room="education"
          className="scroll-mt-24 space-y-8"
          aria-labelledby="edu-heading"
        >
          <SectionTitle id="edu-heading" kicker="02" title={t("education.title")} />
          <EducationGrid items={education} />
        </section>

        <section
          id="skills"
          data-world-room="skills"
          className="scroll-mt-24 space-y-8"
          aria-labelledby="skills-heading"
        >
          <SectionTitle id="skills-heading" kicker="03" title={t("skills.title")} />
          <SkillsGrid groups={skillGroups} />
        </section>

        <section
          id="projects"
          data-world-room="projects"
          className="scroll-mt-24 space-y-8"
          aria-labelledby="proj-heading"
        >
          <SectionTitle id="proj-heading" kicker="04" title={t("projects.title")} />
          <ProjectsGrid items={projects} viewCaseLabel={t("projects.viewCase")} />
        </section>

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
      </main>
    </div>
  );
}
