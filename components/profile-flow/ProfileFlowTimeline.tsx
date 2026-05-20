"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { TimelineEvent, TimelineKind } from "@/lib/profile-timeline";
import { timelineEventToRoom } from "@/world/scroll-rooms";
import type { RoomId } from "@/world/types";

type Labels = {
  types: Record<TimelineKind, string>;
  minorHint: string;
};

type Props = {
  events: TimelineEvent[];
  labels: Labels;
};

const kindStripe: Record<TimelineKind, string> = {
  profile: "flow-stripe--profile",
  experience: "flow-stripe--experience",
  education: "flow-stripe--education",
  skills: "flow-stripe--skills",
};

const EASE = [0.16, 1, 0.3, 1] as const;

function FlowCard({
  event,
  typeLabel,
  align,
  compact = false,
}: {
  event: TimelineEvent;
  typeLabel: string;
  align: "center" | "left" | "right";
  compact?: boolean;
}) {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "md:text-right"
        : "text-left";

  return (
    <article
      className={`flow-card ${kindStripe[event.kind]} ${alignClass} ${compact ? "flow-card--compact" : ""}`}
      tabIndex={0}
    >
      <div
        className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${
          align === "center"
            ? "justify-center"
            : align === "right"
              ? "md:justify-end"
              : "justify-start"
        }`}
      >
        <time
          dateTime={event.dateEnd ? `${event.dateStart}/${event.dateEnd}` : event.dateStart}
          className="flow-card__date"
        >
          {event.dateRange}
        </time>
        <span className="flow-chip">{typeLabel}</span>
      </div>

      <h3 className={`font-semibold tracking-tight text-[var(--foreground)] ${compact ? "mt-2 text-base" : "mt-3 text-lg"}`}>
        {event.title}
      </h3>
      {event.subtitle ? (
        <p className={`text-[var(--muted)] ${compact ? "mt-0.5 text-xs" : "mt-1 text-sm"}`}>
          {event.subtitle}
        </p>
      ) : null}
      {event.meta ? (
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {event.meta}
        </p>
      ) : null}

      {event.kind === "skills" ? (
        <ul
          className={`flex flex-wrap gap-2 ${
            compact ? "mt-2" : "mt-4"
          } ${align === "center" ? "justify-center" : align === "right" ? "md:justify-end" : ""}`}
        >
          {event.bullets.map((item) => (
            <li key={item}>
              <span className="flow-tag">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul
          className={`space-y-1.5 leading-relaxed text-[var(--muted)] ${
            compact ? "mt-2 text-xs" : "mt-4 text-sm"
          }`}
        >
          {event.bullets.map((b) => (
            <li
              key={b}
              className={
                align === "center"
                  ? ""
                  : align === "right"
                    ? "md:flex md:flex-row-reverse md:gap-2 md:items-start"
                    : "flex gap-2 items-start"
              }
            >
              {align !== "center" ? (
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]/70"
                  aria-hidden
                />
              ) : null}
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {event.stack ? (
        <p className={`text-[var(--muted)] ${compact ? "mt-2 text-[10px]" : "mt-4 text-xs"}`}>
          {event.stack}
        </p>
      ) : null}
    </article>
  );
}

function ScrollItem({
  children,
  reduced,
  className = "",
  worldRoom,
}: {
  children: React.ReactNode;
  reduced: boolean | null;
  className?: string;
  worldRoom?: RoomId;
}) {
  return (
    <motion.li
      className={className}
      data-world-room={worldRoom}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -4% 0px" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.li>
  );
}

function FlowSpineDate({ event }: { event: TimelineEvent }) {
  return (
    <time
      dateTime={event.dateEnd ? `${event.dateStart}/${event.dateEnd}` : event.dateStart}
      className={`flow-spine-date ${event.importance === "minor" ? "flow-spine-date--minor" : ""}`}
    >
      {event.spineDate}
    </time>
  );
}

function FlowMajorRow({
  event,
  side,
  typeLabel,
  reduced,
}: {
  event: TimelineEvent;
  side: "left" | "right";
  typeLabel: string;
  reduced: boolean | null;
}) {
  const align = side === "left" ? "left" : "right";

  return (
    <ScrollItem
      reduced={reduced}
      worldRoom={timelineEventToRoom(event)}
      className={`flow-row flow-row--major flow-row--${side}`}
    >
      <div className="flow-row__card">
        <motion.div
          className="flow-card-motion"
          whileHover={reduced ? undefined : { y: -3 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <FlowCard event={event} typeLabel={typeLabel} align={align} />
        </motion.div>
      </div>
      <div className="flow-row__spine">
        <FlowSpineDate event={event} />
        <span className={`flow-node flow-node--major ${kindStripe[event.kind]}`} aria-hidden />
      </div>
      <div className="flow-row__spacer" aria-hidden />
    </ScrollItem>
  );
}

function FlowMinorRow({
  event,
  side,
  typeLabel,
  minorHint,
  reduced,
}: {
  event: TimelineEvent;
  side: "left" | "right";
  typeLabel: string;
  minorHint: string;
  reduced: boolean | null;
}) {
  const [open, setOpen] = useState(false);
  const align = side === "left" ? "left" : "right";
  const expanded = open || Boolean(reduced);

  return (
    <ScrollItem reduced={reduced} className={`flow-row flow-row--minor flow-row--${side}`}>
      <div className={`flow-row__card flow-row__card--minor flow-row__card--${side}`}>
        <motion.div
          className="flow-minor"
          onMouseEnter={() => !reduced && setOpen(true)}
          onMouseLeave={() => !reduced && setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          <button
            type="button"
            className={`flow-minor__trigger ${kindStripe[event.kind]}`}
            aria-expanded={expanded}
            aria-label={`${event.title} — ${event.dateRange}`}
          >
            <span className="flow-minor__dot" aria-hidden />
            <span className="flow-minor__title">{event.title}</span>
          </button>

          <motion.div
            className={`flow-minor__panel flow-minor__panel--${side}`}
            initial={false}
            animate={
              expanded
                ? { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" as const }
                : { opacity: 0, scale: 0.94, y: 6, pointerEvents: "none" as const }
            }
            transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
          >
            <p className="sr-only">{minorHint}</p>
            <FlowCard event={event} typeLabel={typeLabel} align={align} compact />
          </motion.div>
        </motion.div>
      </div>
      <div className="flow-row__spine">
        <FlowSpineDate event={event} />
        <span className={`flow-node flow-node--minor ${kindStripe[event.kind]}`} aria-hidden />
      </div>
      <div className="flow-row__spacer" aria-hidden />
    </ScrollItem>
  );
}

export function ProfileFlowTimeline({ events, labels }: Props) {
  const reduced = useReducedMotion();
  const profile = events.find((e) => e.kind === "profile");
  const skills = events.find((e) => e.kind === "skills");
  const timed = events.filter((e) => e.kind !== "profile" && e.kind !== "skills");

  return (
    <div className="flow-timeline-wrap">
      {(profile || skills) && (
        <ul className="mb-14 grid gap-6 md:gap-8">
          {profile ? (
            <ScrollItem reduced={reduced} worldRoom={timelineEventToRoom(profile)}>
              <FlowCard event={profile} typeLabel={labels.types.profile} align="center" />
            </ScrollItem>
          ) : null}
          {skills ? (
            <ScrollItem reduced={reduced} worldRoom={timelineEventToRoom(skills)}>
              <FlowCard event={skills} typeLabel={labels.types.skills} align="center" />
            </ScrollItem>
          ) : null}
        </ul>
      )}

      <ol className="flow-timeline">
        {timed.map((event, index) => {
          const side = index % 2 === 0 ? "left" : "right";
          const typeLabel = labels.types[event.kind];

          if (event.importance === "minor") {
            return (
              <FlowMinorRow
                key={event.id}
                event={event}
                side={side}
                typeLabel={typeLabel}
                minorHint={labels.minorHint}
                reduced={reduced}
              />
            );
          }

          return (
            <FlowMajorRow
              key={event.id}
              event={event}
              side={side}
              typeLabel={typeLabel}
              reduced={reduced}
            />
          );
        })}
      </ol>
    </div>
  );
}
