"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useWorldExperienceStore } from "@/stores/world-experience-store";
import { useWorldStore } from "@/stores/world-store";
import { isExperienceJobId } from "@/world/experience-cameras";

export type ExperienceScrumBlock = {
  title: string;
  period: string;
  intro: string;
  bullets: string[];
};

export type ExperienceStage = {
  title: string;
  text: string;
};

export type ExperienceItem = {
  id: string;
  period: string;
  title: string;
  company: string;
  /** Rótulo curto só no menu lateral (opcional). */
  companyMenu?: string;
  location: string;
  stack: string;
  bullets: string[];
  narrative?: string[];
  stages?: ExperienceStage[];
  scrum?: ExperienceScrumBlock;
};

type Props = { items: ExperienceItem[] };

function resolveStages(job: ExperienceItem): ExperienceStage[] {
  if (job.stages?.length) return job.stages;
  if (job.narrative?.length) {
    return job.narrative.map((text) => ({ title: "", text }));
  }
  if (job.bullets.length > 0) {
    return job.bullets.map((text) => ({ title: "", text }));
  }
  return [{ title: "", text: "" }];
}

function stageLabel(
  stage: ExperienceStage,
  stageIndex: number,
  t: (key: string, values?: Record<string, string | number>) => string,
) {
  if (stageIndex === 0) return t("stageProjectDescription");
  return stage.title || t("stageMoment", { n: stageIndex });
}

/** Etapa em modo telefone (vertical) no desktop — volta ao horizontal nas outras. */
const ALEMSYS_PHONE_STAGE_INDICES = new Set([1, 3, 5]);

function usesVerticalPhoneLayout(jobId: string, stageIndex: number): boolean {
  return jobId === "alemsys" && ALEMSYS_PHONE_STAGE_INDICES.has(stageIndex);
}

function StageArrowButton({
  direction,
  onClick,
  label,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="site-chip-btn h-9 w-9"
    >
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        fill="none"
        className="h-4 w-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "prev" ? (
          <path d="M12.5 4.5 7.5 10l5 5.5" />
        ) : (
          <path d="M7.5 4.5 12.5 10l-5 5.5" />
        )}
      </svg>
    </button>
  );
}

function ExperienceCard({
  job,
  stage,
  stageIndex,
  stageCount,
  reduced,
  withStageNav = false,
  phoneLayout = false,
  onPrevStage,
  onNextStage,
}: {
  job: ExperienceItem;
  stage: ExperienceStage;
  stageIndex: number;
  stageCount: number;
  reduced: boolean | null;
  withStageNav?: boolean;
  phoneLayout?: boolean;
  onPrevStage?: () => void;
  onNextStage?: () => void;
}) {
  const t = useTranslations("Home.experience");
  const isOverview = stageIndex === 0;
  const headerTitle = stageLabel(stage, stageIndex, t);
  const useOverviewShell = isOverview || phoneLayout;

  return (
    <motion.article
      layout
      className={[
        "relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)]/85 backdrop-blur-md",
        useOverviewShell
          ? "experience-card--overview experience-card--phone p-4 sm:p-5"
          : "experience-card--moment p-3 sm:p-3.5",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute -right-16 -top-16 rounded-full bg-[var(--accent)]/10 blur-3xl",
          isOverview ? "h-32 w-32" : "h-20 w-20 opacity-60",
        ].join(" ")}
      />

      {withStageNav && stageCount > 1 && onPrevStage && onNextStage ? (
        <nav
          aria-label={t("stageNavLabel")}
          className={[
            "experience-stage-header -mx-0.5 border-b border-[var(--border)]/60",
            phoneLayout
              ? "mb-3 flex flex-col gap-2 pb-2.5 text-left"
              : [
                  "flex items-center gap-2",
                  isOverview ? "mb-4 pb-3" : "mb-2.5 pb-2",
                ].join(" "),
          ].join(" ")}
        >
          {phoneLayout ? (
            <>
              <div className="flex items-center gap-2">
                <StageArrowButton direction="prev" onClick={onPrevStage} label={t("stagePrev")} />
                <div className="min-w-0 flex-1 text-left">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={`${stageIndex}-${headerTitle}`}
                      initial={reduced ? false : { opacity: 0, y: 5 }}
                      animate={reduced ? undefined : { opacity: 1, y: 0 }}
                      exit={reduced ? undefined : { opacity: 0, y: -5 }}
                      transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                      className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] sm:text-xs"
                    >
                      {headerTitle}
                    </motion.p>
                  </AnimatePresence>
                  <p className="sr-only">
                    {t("stagePosition", { current: stageIndex + 1, total: stageCount })}
                  </p>
                </div>
                <StageArrowButton direction="next" onClick={onNextStage} label={t("stageNext")} />
              </div>
            </>
          ) : (
            <>
              <StageArrowButton direction="prev" onClick={onPrevStage} label={t("stagePrev")} />
              <div className="min-w-0 flex-1 text-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${stageIndex}-${headerTitle}`}
                    initial={reduced ? false : { opacity: 0, y: 5 }}
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -5 }}
                    transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                    className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)] sm:text-xs"
                  >
                    {headerTitle}
                  </motion.p>
                </AnimatePresence>
                <p className="sr-only">
                  {t("stagePosition", { current: stageIndex + 1, total: stageCount })}
                </p>
              </div>
              <StageArrowButton direction="next" onClick={onNextStage} label={t("stageNext")} />
            </>
          )}
        </nav>
      ) : (
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            {job.period}
          </p>
          <p className="text-xs text-[var(--muted)]">{job.location}</p>
        </div>
      )}

      {isOverview ? (
        <>
          <h3 className="text-base font-semibold text-[var(--foreground)] sm:text-lg">{job.title}</h3>
          <p className="text-sm text-[var(--muted)]">{job.company}</p>
        </>
      ) : (
        <span className="sr-only">
          {job.title} · {job.company}
        </span>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${job.id}-stage-${stageIndex}`}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {isOverview ? (
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
              <p>{stage.text}</p>
            </div>
          ) : (
            <p
              className={[
                "text-[var(--muted)]",
                phoneLayout
                  ? "text-left text-sm leading-relaxed"
                  : "text-[13px] leading-snug sm:text-sm sm:leading-relaxed",
              ].join(" ")}
            >
              {stage.text}
            </p>
          )}

          {isOverview ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.stack.split(",").map((tech) => (
                <span
                  key={tech.trim()}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)]/50 px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </motion.article>
  );
}

export function ExperienceTimeline({ items }: Props) {
  const t = useTranslations("Home.experience");
  const reduced = useReducedMotion();
  const setFocusRoom = useWorldStore((s) => s.setFocusRoom);
  const setActiveJob = useWorldExperienceStore((s) => s.setActiveJob);
  const setActiveStage = useWorldExperienceStore((s) => s.setActiveStage);
  const storeStageIndex = useWorldExperienceStore((s) => s.activeStageIndex);

  const initialId = useMemo(() => {
    if (items.length === 0) return "";
    return items.find((item) => item.id === "vittahub")?.id ?? items[0]!.id;
  }, [items]);

  const [activeId, setActiveId] = useState(initialId);
  const active = items.find((item) => item.id === activeId) ?? items[0];
  const stages = useMemo(() => (active ? resolveStages(active) : []), [active]);
  const stageIndex =
    stages.length > 0 ? ((storeStageIndex % stages.length) + stages.length) % stages.length : 0;
  const currentStage = stages[stageIndex] ?? stages[0];
  const isMomentStage = stageIndex > 0;
  const verticalPhoneLayout = usesVerticalPhoneLayout(active.id, stageIndex);
  const showHorizontalPeephole = isMomentStage && !verticalPhoneLayout;
  const showVerticalPeephole = verticalPhoneLayout;

  const selectJob = (jobId: string) => {
    setActiveId(jobId);
    setFocusRoom("experience");
    if (isExperienceJobId(jobId)) {
      setActiveJob(jobId);
      setActiveStage(0);
    }
  };

  const shiftStage = (delta: -1 | 1) => {
    if (stages.length <= 1) return;
    const next = (stageIndex + delta + stages.length) % stages.length;
    setFocusRoom("experience");
    setActiveStage(next);
  };

  useEffect(() => {
    if (isExperienceJobId(initialId)) setActiveJob(initialId);
  }, [initialId, setActiveJob]);

  if (!active || !currentStage) return null;

  return (
    <>
      {/* Mobile: lista com etapas empilhadas */}
      <div className="flex flex-col gap-6 lg:hidden">
        {items.map((job, index) => {
          const jobStages = resolveStages(job);
          return (
            <div key={job.id} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                {job.period} · {job.company}
              </p>
              {jobStages.map((stage, stageIdx) => (
                <ExperienceCard
                  key={`${job.id}-${stageIdx}`}
                  job={job}
                  stage={stage}
                  stageIndex={stageIdx}
                  stageCount={jobStages.length}
                  reduced={reduced}
                />
              ))}
              {index < items.length - 1 ? (
                <hr className="border-[var(--border)]/60" />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Desktop: menu + campo alto com etapas e câmara */}
      <div className="experience-panel hidden gap-10 lg:grid lg:grid-cols-[minmax(200px,0.85fr)_minmax(0,1.85fr)] lg:items-stretch">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label={t("title")}>
            <ol className="relative space-y-0.5 border-l border-[var(--border)]/80 pl-5">
              {items.map((job, index) => {
                const isActive = job.id === active.id;
                return (
                  <motion.li
                    key={job.id}
                    initial={reduced ? false : { opacity: 0, x: -10 }}
                    whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                    transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative"
                  >
                    <span
                      aria-hidden
                      className={[
                        "absolute -left-px top-[1.125rem] h-2 w-2 -translate-x-1/2 rounded-full ring-4 ring-[var(--background)] transition-colors duration-300",
                        isActive
                          ? "bg-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]"
                          : "bg-[var(--border)] group-hover:bg-[var(--accent)]/40",
                      ].join(" ")}
                    />
                    <button
                      type="button"
                      onClick={() => selectJob(job.id)}
                      aria-pressed={isActive}
                      className={[
                        "site-panel-btn group w-full border-l-2 py-3 pl-4 text-left transition-colors duration-300",
                        isActive
                          ? "border-[var(--accent)]"
                          : "border-transparent hover:border-[var(--accent)]/25",
                      ].join(" ")}
                    >
                      <p
                        className={[
                          "text-[10px] font-medium uppercase tracking-[0.14em] transition-colors",
                          isActive ? "text-[var(--accent)]" : "text-[var(--muted)]",
                        ].join(" ")}
                      >
                        {job.period}
                      </p>
                      <p
                        className={[
                          "mt-1 text-sm leading-snug transition-colors",
                          isActive
                            ? "font-semibold text-[var(--foreground)]"
                            : "font-medium text-[var(--foreground)]/75 group-hover:text-[var(--foreground)]",
                        ].join(" ")}
                      >
                        {job.companyMenu ?? job.company}
                      </p>
                      <p
                        className={[
                          "mt-0.5 text-xs leading-snug transition-colors",
                          isActive ? "text-[var(--muted)]" : "text-[var(--muted)]/80",
                        ].join(" ")}
                      >
                        {job.title}
                      </p>
                    </button>
                  </motion.li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div
          key={`${active.id}-${verticalPhoneLayout ? "phone" : "desktop"}`}
          className={[
            "experience-stage-field relative flex min-h-[min(78vh,760px)] flex-col",
            verticalPhoneLayout ? "experience-stage-field--phone" : "",
          ].join(" ")}
        >
          <AnimatePresence mode="popLayout">
            {showVerticalPeephole ? (
              <motion.div
                key="peephole-phone"
                initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="experience-peephole experience-peephole--phone flex-shrink-0"
                aria-hidden
              />
            ) : showHorizontalPeephole ? (
              <motion.div
                key="peephole-horizontal"
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={reduced ? undefined : { height: "48%", opacity: 1 }}
                exit={reduced ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="experience-peephole experience-peephole--paired mb-1.5 min-h-[220px] flex-shrink-0"
                aria-hidden
              />
            ) : null}
          </AnimatePresence>

          <motion.div
            layout
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "min-w-0 flex-shrink-0",
              verticalPhoneLayout
                ? "experience-stage-card--phone w-full self-stretch"
                : "w-full self-start",
            ].join(" ")}
          >
            <ExperienceCard
              job={active}
              stage={currentStage}
              stageIndex={stageIndex}
              stageCount={stages.length}
              reduced={reduced}
              withStageNav
              phoneLayout={verticalPhoneLayout}
              onPrevStage={() => shiftStage(-1)}
              onNextStage={() => shiftStage(1)}
            />
          </motion.div>

          {!showHorizontalPeephole && !showVerticalPeephole ? (
            <div className="min-h-0 flex-1" aria-hidden />
          ) : null}
        </div>
      </div>
    </>
  );
}
