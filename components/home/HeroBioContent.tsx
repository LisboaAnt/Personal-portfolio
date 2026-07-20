"use client";

import { useCallback, type MouseEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useWorldNavigate } from "@/hooks/useWorldNavigate";
import { useWorldExperienceStore } from "@/stores/world-experience-store";
import { isExperienceJobId, type ExperienceJobId } from "@/world/experience-cameras";

function BioMark({ children }: { children: ReactNode }) {
  return (
    <span className="hero-bio-mark font-medium text-[var(--foreground)]">{children}</span>
  );
}

function BioExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="hero-bio-link font-medium text-[var(--foreground)]"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

type BioNavLinkProps = {
  href: `#${string}`;
  jobId?: ExperienceJobId;
  children: ReactNode;
};

function BioNavLink({ href, jobId, children }: BioNavLinkProps) {
  const { navigate, enabled } = useWorldNavigate();

  const onClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (jobId && isExperienceJobId(jobId)) {
        useWorldExperienceStore.getState().setActiveJob(jobId);
        useWorldExperienceStore.getState().setActiveStage(0);
      }
      if (!enabled) return;
      e.preventDefault();
      navigate(href);
    },
    [enabled, href, jobId, navigate],
  );

  return (
    <a href={href} className="hero-bio-link font-medium text-[var(--foreground)]" onClick={onClick}>
      {children}
    </a>
  );
}

/** Bio da hero — links internos respeitam secção CV + job de experiência. */
export function HeroBioContent() {
  const t = useTranslations("Home.hero");
  const tHome = useTranslations("Home");

  const tags = {
    vittahub: (chunks: ReactNode) => (
      <BioNavLink href="#experience" jobId="vittahub">
        {chunks}
      </BioNavLink>
    ),
    lead: (chunks: ReactNode) => (
      <BioNavLink href="#experience" jobId="vittahub">
        {chunks}
      </BioNavLink>
    ),
    scrum: (chunks: ReactNode) => (
      <BioNavLink href="#experience" jobId="vittahub">
        {chunks}
      </BioNavLink>
    ),
    ufc: (chunks: ReactNode) => (
      <BioNavLink href="#education">{chunks}</BioNavLink>
    ),
    degree: (chunks: ReactNode) => (
      <BioNavLink href="#education">{chunks}</BioNavLink>
    ),
    focus: (chunks: ReactNode) => (
      <BioNavLink href="#skills">{chunks}</BioNavLink>
    ),
    strong: (chunks: ReactNode) => <BioMark>{chunks}</BioMark>,
    projects: (chunks: ReactNode) => (
      <BioNavLink href="#projects">{chunks}</BioNavLink>
    ),
    github: (chunks: ReactNode) => (
      <BioExternalLink href={tHome("social.github")}>{chunks}</BioExternalLink>
    ),
  };

  return (
    <div className="hero-bio mt-5 sm:mt-10">
      <div className="space-y-3 sm:space-y-5">
        <p className="hero-bio-line sm:hidden">{t.rich("bioLine1Mobile", tags)}</p>
        <p className="hero-bio-line hidden sm:block">{t.rich("bioLine1", tags)}</p>
        <p className="hero-bio-line hero-bio-line--extra hidden sm:block">
          {t.rich("bioLine2", tags)}
        </p>
      </div>
    </div>
  );
}
