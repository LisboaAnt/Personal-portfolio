import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

function BioMark({ children }: { children: ReactNode }) {
  return (
    <span className="hero-bio-mark font-medium text-[var(--foreground)]">{children}</span>
  );
}

function BioLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className="hero-bio-link font-medium text-[var(--foreground)]"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function makeRichTags(githubHref: string) {
  return {
    vittahub: (chunks: ReactNode) => <BioMark>{chunks}</BioMark>,
    ufc: (chunks: ReactNode) => <BioMark>{chunks}</BioMark>,
    lead: (chunks: ReactNode) => <BioMark>{chunks}</BioMark>,
    focus: (chunks: ReactNode) => <BioMark>{chunks}</BioMark>,
    strong: (chunks: ReactNode) => <BioMark>{chunks}</BioMark>,
    scrum: (chunks: ReactNode) => <BioLink href="#scrum-master">{chunks}</BioLink>,
    projects: (chunks: ReactNode) => <BioLink href="#projects">{chunks}</BioLink>,
    github: (chunks: ReactNode) => <BioLink href={githubHref}>{chunks}</BioLink>,
  };
}

const LINES = ["bioLine1", "bioLine2"] as const;

/** Bio da hero — duas linhas, estilo editorial (referência Max Böck). */
export async function HeroBioServer() {
  const t = await getTranslations("Home.hero");
  const tHome = await getTranslations("Home");
  const tags = makeRichTags(tHome("social.github"));

  return (
    <div className="hero-bio mt-8 sm:mt-10">
      <div className="space-y-4 sm:space-y-5">
        {LINES.map((key) => (
          <p key={key} className="hero-bio-line">
            {t.rich(key, tags)}
          </p>
        ))}
      </div>
    </div>
  );
}
