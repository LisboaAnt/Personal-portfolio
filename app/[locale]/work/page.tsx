import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ProjectTiltVisual } from "@/components/ProjectTiltVisual";

type Props = { params: Promise<{ locale: string }> };

type WorkItem = {
  id: string;
  status: string;
  title: string;
  role: string;
  period: string;
  context: string;
  impact: string[];
  stack: string;
  note?: string;
  cover: string;
  coverAlt: string;
};

const shell =
  "overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-md dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Work.meta" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function WorkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Work");
  const items = t.raw("items") as WorkItem[];

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-12 sm:px-6 sm:py-16">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{t("kicker")}</p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{t("intro")}</p>
        <Link
          href="/lab"
          className="inline-block text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {t("labLink")}
        </Link>
      </header>

      <ol className="space-y-10">
        {items.map((item) => (
          <li key={item.id} id={item.id} className="scroll-mt-28">
            <article className={shell}>
              <ProjectTiltVisual src={item.cover} alt={item.coverAlt} />
              <div className="space-y-1 p-6 pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                  {item.status}
                </span>
                <span className="text-xs text-[var(--muted)]">{item.period}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-1 text-sm font-medium text-[var(--muted)]">{item.role}</p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{item.context}</p>
              <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]">
                {t("impactHeading")}
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-[var(--muted)]">
                {item.impact.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[var(--muted)]">{item.stack}</p>
              {item.note ? <p className="mt-2 text-xs italic text-[var(--muted)]">{item.note}</p> : null}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
