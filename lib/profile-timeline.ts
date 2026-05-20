export type TimelineKind = "profile" | "experience" | "education" | "skills";
export type TimelineImportance = "major" | "minor";

export type TimelineEvent = {
  id: string;
  kind: TimelineKind;
  importance: TimelineImportance;
  sortKey: string;
  /** Intervalo completo, ex.: 01/2025 — presente */
  dateRange: string;
  /** Data na coluna central (ano ou mês/ano) */
  spineDate: string;
  /** Início ISO YYYY-MM */
  dateStart: string;
  /** Fim ISO ou null = em curso */
  dateEnd: string | null;
  period?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  stack?: string;
  bullets: string[];
  skillItems?: string[];
};

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

export type FlowMinorEventInput = {
  id: string;
  kind: TimelineKind;
  period: string;
  title: string;
  subtitle?: string;
  meta?: string;
  stack?: string;
  bullets: string[];
};

export type ProfileTimelineInput = {
  profile: {
    title: string;
    role: string;
    summary: string;
    highlights: Highlight[];
  };
  skillsTitle: string;
  presentLabel: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skillGroups: SkillGroup[];
  /** IDs de eventos do Home que devem aparecer só como bolinha (ex.: mentoria paralela) */
  minorIds?: string[];
  /** Marcos extra só no fluxo (bolinha + hover) */
  extraMinors?: FlowMinorEventInput[];
};

const PRESENT = /presente|present|aktuell|actual|heute|atual/i;

function parseMonthYear(part: string): { month: string; year: string } | null {
  const m = part.trim().match(/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  return { month: m[1].padStart(2, "0"), year: m[2] };
}

function partToSortKey(part: string): string {
  if (PRESENT.test(part)) return "2099-12";
  const parsed = parseMonthYear(part);
  if (parsed) return `${parsed.year}-${parsed.month}`;
  return "1970-01";
}

export function periodToSortKey(period: string): string {
  const parts = period.split(/[—–-]/).map((s) => s.trim());
  const end = parts[parts.length - 1] ?? period;
  return partToSortKey(end);
}

export function parsePeriod(
  period: string,
  presentLabel: string
): {
  sortKey: string;
  dateStart: string;
  dateEnd: string | null;
  spineDate: string;
  dateRange: string;
} {
  const parts = period.split(/[—–-]/).map((s) => s.trim());
  const startPart = parts[0] ?? period;
  const endPart = parts[parts.length - 1] ?? period;
  const isPresent = PRESENT.test(endPart);
  const dateStart = partToSortKey(startPart);
  const dateEnd = isPresent ? null : partToSortKey(endPart);
  const sortKey = dateEnd ?? dateStart;

  const startParsed = parseMonthYear(startPart);
  const endParsed = isPresent ? null : parseMonthYear(endPart);

  const spineDate = (() => {
    if (isPresent && startParsed) return startParsed.year;
    if (endParsed) return endParsed.year;
    if (startParsed) return startParsed.year;
    return sortKey.slice(0, 4);
  })();

  const dateRange = period.replace(PRESENT, presentLabel);

  return { sortKey, dateStart, dateEnd, spineDate, dateRange };
}

function toTimedEvent(
  item: {
    id: string;
    kind: TimelineKind;
    period: string;
    title: string;
    subtitle?: string;
    meta?: string;
    stack?: string;
    bullets: string[];
  },
  importance: TimelineImportance,
  presentLabel: string
): TimelineEvent {
  const dates = parsePeriod(item.period, presentLabel);
  return {
    id: item.id,
    kind: item.kind,
    importance,
    sortKey: dates.sortKey,
    dateRange: dates.dateRange,
    spineDate: dates.spineDate,
    dateStart: dates.dateStart,
    dateEnd: dates.dateEnd,
    period: item.period,
    title: item.title,
    subtitle: item.subtitle,
    meta: item.meta,
    stack: item.stack,
    bullets: item.bullets,
  };
}

export function buildProfileTimeline(input: ProfileTimelineInput): TimelineEvent[] {
  const {
    profile,
    skillsTitle,
    presentLabel,
    experience,
    education,
    skillGroups,
    minorIds = [],
    extraMinors = [],
  } = input;

  const minorSet = new Set(minorIds);

  const timed: TimelineEvent[] = [
    ...experience.map((job) =>
      toTimedEvent(
        {
          id: job.id,
          kind: "experience",
          period: job.period,
          title: job.title,
          subtitle: `${job.company} · ${job.location}`,
          stack: job.stack,
          bullets: job.bullets,
        },
        minorSet.has(job.id) ? "minor" : "major",
        presentLabel
      )
    ),
    ...education.map((edu) =>
      toTimedEvent(
        {
          id: edu.id,
          kind: "education",
          period: edu.period,
          title: edu.title,
          subtitle: edu.institution,
          meta: edu.meta,
          bullets: edu.bullets,
        },
        minorSet.has(edu.id) ? "minor" : "major",
        presentLabel
      )
    ),
    ...extraMinors.map((m) =>
      toTimedEvent(
        {
          id: m.id,
          kind: m.kind,
          period: m.period,
          title: m.title,
          subtitle: m.subtitle,
          meta: m.meta,
          stack: m.stack,
          bullets: m.bullets,
        },
        "minor",
        presentLabel
      )
    ),
  ].sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  const skillItems = skillGroups.flatMap((g) =>
    g.items.map((item) => `${g.label}: ${item}`)
  );

  return [
    {
      id: "profile",
      kind: "profile",
      importance: "major",
      sortKey: "2100-01",
      dateRange: presentLabel,
      spineDate: presentLabel,
      dateStart: "2100-01",
      dateEnd: null,
      title: profile.title,
      subtitle: profile.role,
      bullets: [profile.summary, ...profile.highlights.map((h) => `${h.label}: ${h.value}`)],
    },
    {
      id: "skills",
      kind: "skills",
      importance: "major",
      sortKey: "2099-11",
      dateRange: presentLabel,
      spineDate: presentLabel,
      dateStart: "2099-11",
      dateEnd: null,
      title: skillsTitle,
      skillItems,
      bullets: skillGroups.flatMap((g) => g.items),
    },
    ...timed,
  ];
}
