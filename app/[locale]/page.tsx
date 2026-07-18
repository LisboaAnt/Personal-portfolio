import { getTranslations, setRequestLocale } from "next-intl/server";
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
import { ProjectsMetro, type ProjectMetroGroup } from "@/components/home/ProjectsMetro";
import { ContactSection } from "@/components/home/ContactSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionTitle } from "@/components/motion/SectionTitle";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const experience = t.raw("experience.items") as ExperienceItem[];
  const education = t.raw("education.items") as EducationItem[];
  const educationDiplomas = t.raw("education.diplomas.items") as EducationDiploma[];
  const skillGroups = t.raw("skills.groups") as SkillGroup[];
  const projectGroups = t.raw("projects.groups") as ProjectMetroGroup[];
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
          <SectionTitle id="exp-heading" title={t("experience.title")} showDivider={false} />
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
        <div className="cv-snap-section__inner education-section__inner">
          <SectionTitle id="edu-heading" title={t("education.title")} showDivider={false} />
          <EducationGrid items={education} />
          <EducationDiplomaCarousel
            title={t("education.diplomas.title")}
            prevLabel={t("education.diplomas.prev")}
            nextLabel={t("education.diplomas.next")}
            closeLabel={t("education.close")}
            items={educationDiplomas}
          />
        </div>
      </section>

      <section
        id="skills"
        data-world-room="skills"
        className="cv-snap-section skills-section scroll-mt-24"
        aria-labelledby="skills-heading"
      >
        <div className="cv-snap-section__inner skills-section__inner">
          <SectionTitle id="skills-heading" title={t("skills.title")} showDivider={false} />
          <SkillsGrid groups={skillGroups} />
        </div>
      </section>

      <section
        id="projects"
        data-world-room="projects"
        className="cv-snap-section projects-section scroll-mt-24"
        aria-labelledby="proj-heading"
      >
        <div className="cv-snap-section__inner projects-section__inner">
          <SectionTitle id="proj-heading" title={t("projects.title")} showDivider={false} />
          <ProjectsMetro groups={projectGroups} />
        </div>
      </section>

      <section
        id="contact"
        data-world-room="contact"
        className="cv-snap-section contact-section scroll-mt-24"
        aria-labelledby="contact-heading"
      >
        <div className="cv-snap-section__inner contact-section__inner">
          <SectionTitle id="contact-heading" title={t("contact.title")} showDivider={false} />
          <ContactSection
            body={t("contact.body")}
            email={email}
            sealsKicker={t("contact.sealsKicker")}
            github={{
              href: t("social.github"),
              label: t("social.githubLabel"),
              handle: t("social.githubHandle"),
            }}
            linkedin={{
              href: t("social.linkedin"),
              label: t("social.linkedinLabel"),
              handle: t("social.linkedinHandle"),
            }}
            instagram={{
              href: t("social.instagram"),
              label: t("social.instagramLabel"),
              handle: t("social.instagramHandle"),
            }}
          />

          <SiteFooter locale={locale} variant="inline" />
        </div>
      </section>
    </div>
  );
}
