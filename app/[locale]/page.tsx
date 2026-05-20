import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
import { Link } from "@/i18n/navigation";
import { HeroKicker } from "@/components/HeroKicker";
import { ProjectTiltVisual } from "@/components/ProjectTiltVisual";

type Props = { params: Promise<{ locale: string }> };

type Highlight = { label: string; value: string };

type ExperienceItem = {
  id: string;
  period: string;
  title: string;
  company: string;
  location: string;
  stack: string;
  bullets: string[];
};

type EducationItem = {
  id: string;
  period: string;
  title: string;
  institution: string;
  meta: string;
  bullets: string[];
};

type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

type ProjectItem = {
  id: string;
  title: string;
  role: string;
  description: string;
  stack: string;
  cover: string;
  coverAlt: string;
  bullets?: string[];
};

const card =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 p-5 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-md dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]";

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const te = await getTranslations("Easter");

  const h = await headers();
  const country = h.get("x-vercel-ip-country");
  const acceptLanguage = h.get("accept-language");

  const highlights = t.raw("highlights") as Highlight[];
  const experience = t.raw("experience.items") as ExperienceItem[];
  const education = t.raw("education.items") as EducationItem[];
  const skillGroups = t.raw("skills.groups") as SkillGroup[];
  const projects = t.raw("projects.items") as ProjectItem[];

  const email = t("contact.email");

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:gap-16">
        <header
          id="profile"
          data-world-room="profile"
          className="flex flex-col gap-6 scroll-mt-24 lg:flex-row lg:items-start lg:justify-between"
        >
          <div className={`${card} relative max-w-2xl overflow-hidden`}>
            <div
              className="pointer-events-none absolute -right-16 -top-24 h-48 w-48 rounded-full bg-[var(--accent-soft)] blur-3xl"
              aria-hidden
            />
            <HeroKicker
              threshold={7}
              toast={te("kickerToast")}
              ariaLabel={t("hero.kicker")}
            >
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                {t("hero.kicker")}
              </span>
            </HeroKicker>
            <p className="mt-3 text-sm font-medium text-[var(--muted)]">{t("hero.role")}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("hero.title")}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
              {t("hero.summary")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
              >
                {t("hero.ctaProjects")}
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]/40"
              >
                {t("hero.ctaEmail")}
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
              >
                {t("hero.ctaContact")}
              </a>
              <Link
                href="/flow"
                className="inline-flex items-center justify-center rounded-full border border-[var(--accent)]/35 bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:border-[var(--accent)]/60 hover:brightness-110"
              >
                {t("hero.ctaFlow")}
              </Link>
              <Link
                href="/lab"
                className="text-sm font-medium text-[var(--muted)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
              >
                {t("hero.ctaLab")}
              </Link>
            </div>
            <a
              href={t("hero.siteUrl")}
              className="mt-5 inline-block text-sm font-medium text-[var(--muted)] underline-offset-4 hover:text-[var(--foreground)] hover:underline"
            >
              {t("hero.siteLabel")}
            </a>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 lg:w-56">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {highlights.map((hItem) => (
                <div
                  key={hItem.label}
                  className={`${card} !p-3 text-right sm:text-left`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {hItem.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium leading-snug">{hItem.value}</p>
                </div>
              ))}
            </div>
            <Link
              href="/work"
              className={`${card} !flex !flex-col !p-4 text-left transition hover:border-[var(--accent)]/35`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                {t("homeWorkTeaser.kicker")}
              </span>
              <span className="mt-1 text-sm font-medium text-[var(--foreground)]">{t("homeWorkTeaser.title")}</span>
              <span className="mt-1 text-xs text-[var(--muted)]">{t("homeWorkTeaser.body")}</span>
            </Link>
          </div>
        </header>

        <main id="content" className="flex flex-col gap-16">
          <section
            id="experience"
            data-world-room="experience"
            className="site-reveal scroll-mt-24 space-y-6"
            aria-labelledby="exp-heading"
          >
            <div className="flex items-end justify-between gap-4">
              <h2
                id="exp-heading"
                className="text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {t("experience.title")}
              </h2>
              <span
                className="hidden h-px flex-1 translate-y-[-0.6rem] bg-gradient-to-r from-[var(--border)] to-transparent sm:block"
                aria-hidden
              />
            </div>
            <ol className="relative space-y-6 border-l border-[var(--border)] pl-6 sm:pl-8">
              {experience.map((job) => (
                <li key={job.id} className="relative">
                  <span
                    className="absolute -left-[calc(0.5rem+5px)] top-2 h-2.5 w-2.5 rounded-full border-2 border-[var(--surface)] bg-[var(--accent)] sm:-left-[calc(1rem+5px)]"
                    aria-hidden
                  />
                  <article className={card}>
                    <p className="text-xs font-medium text-[var(--accent)]">{job.period}</p>
                    <h3 className="mt-1 text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-[var(--muted)]">
                      {job.company} · {job.location}
                    </p>
                    <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-[var(--muted)]">
                      {job.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-[var(--muted)]">{job.stack}</p>
                  </article>
                </li>
              ))}
            </ol>
          </section>

          <section
            id="education"
            data-world-room="education"
            className="site-reveal scroll-mt-24 space-y-6"
            aria-labelledby="edu-heading"
          >
            <h2 id="edu-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("education.title")}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {education.map((edu) => (
                <article key={edu.id} className={card}>
                  <p className="text-xs font-medium text-[var(--accent)]">{edu.period}</p>
                  <h3 className="mt-2 text-base font-semibold leading-snug">{edu.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{edu.institution}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-[var(--muted)]">
                    {edu.meta}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
                    {edu.bullets.map((b) => (
                      <li key={b} className="leading-snug">
                        · {b}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section
            id="skills"
            data-world-room="skills"
            className="site-reveal scroll-mt-24 space-y-6"
            aria-labelledby="skills-heading"
          >
            <h2 id="skills-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("skills.title")}
            </h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {skillGroups.map((g) => (
                <div key={g.id} className={card}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {g.label}
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {g.items.map((item) => (
                      <li key={item}>
                        <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-2.5 py-1 text-xs font-medium text-[var(--foreground)]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section
            id="projects"
            data-world-room="projects"
            className="site-reveal scroll-mt-24 space-y-6"
            aria-labelledby="proj-heading"
          >
            <h2 id="proj-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("projects.title")}
            </h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {projects.map((p) => (
                <li key={p.id} className={`${card} group flex flex-col gap-3 transition hover:border-[var(--accent)]/30`}>
                  <ProjectTiltVisual src={p.cover} alt={p.coverAlt} />
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                    {p.role}
                  </p>
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-[var(--muted)]">{p.description}</p>
                  {p.bullets && p.bullets.length > 0 ? (
                    <ul className="space-y-1 text-sm text-[var(--muted)]">
                      {p.bullets.map((b) => (
                        <li key={b}>· {b}</li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="text-xs text-[var(--muted)]">{p.stack}</p>
                  <Link
                    href={{ pathname: "/work", hash: p.id }}
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] underline-offset-4 group-hover:underline"
                  >
                    {t("projects.viewCase")}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section
            id="contact"
            data-world-room="contact"
            className={`${card} site-reveal scroll-mt-24`}
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-lg font-semibold">
              {t("contact.title")}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">{t("contact.body")}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                href={`mailto:${email}`}
              >
                {email}
              </a>
              <a
                className="inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:border-[var(--accent)]/50"
                href={t("social.github")}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t("social.githubLabel")}
              </a>
              <a
                className="inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:border-[var(--accent)]/50"
                href={t("social.linkedin")}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t("social.linkedinLabel")}
              </a>
            </div>
          </section>

          <section className={`${card} site-reveal border-dashed`} aria-labelledby="contrib-heading">
            <h2 id="contrib-heading" className="text-base font-semibold">
              {t("contribute.title")}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("contribute.body")}</p>
          </section>

          <details className="site-reveal group rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)]/40 text-sm backdrop-blur-sm">
            <summary className="cursor-pointer list-none px-4 py-3 font-medium text-[var(--muted)] marker:hidden [&::-webkit-details-marker]:hidden">
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
        </main>
    </div>
  );
}
