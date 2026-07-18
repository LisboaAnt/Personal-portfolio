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

/** Bio da hero — mobile: linha curta + 2.ª se houver altura; desktop: 2 linhas. */
export async function HeroBioServer() {
  const t = await getTranslations("Home.hero");
  const tHome = await getTranslations("Home");
  const tags = makeRichTags(tHome("social.github"));

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
