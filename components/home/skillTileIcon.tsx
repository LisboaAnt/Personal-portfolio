import type { ReactElement, ReactNode } from "react";

/** Ícones monochrome para subtiles — match por nome (en/es/de). */

type IconProps = { className?: string };

function Svg({ children, className }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function IconCode(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 7 3 12l5 5M16 7l5 5-5 5M13 5l-2 14" />
    </Svg>
  );
}

function IconAtom(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
    </Svg>
  );
}

function IconHex(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 19.5 8v8L12 20.5 4.5 16V8L12 3.5Z" />
      <path d="M12 8v8M8.5 10.5 12 12.5l3.5-2" />
    </Svg>
  );
}

function IconDb(props: IconProps) {
  return (
    <Svg {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
    </Svg>
  );
}

function IconBox(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="M12 12 20 7.5M12 12v9M12 12 4 7.5" />
    </Svg>
  );
}

function IconNodes(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="7" r="2.2" />
      <circle cx="18" cy="7" r="2.2" />
      <circle cx="12" cy="17" r="2.2" />
      <path d="M8 8.2 10.5 15M16 8.2 13.5 15M8.2 7h7.6" />
    </Svg>
  );
}

function IconWind(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 9h11a2.5 2.5 0 1 0-1.7-4.3" />
      <path d="M4 13h14a2.5 2.5 0 1 1-1.7 4.3" />
      <path d="M4 17h7a2 2 0 1 1-1.4 3.4" />
    </Svg>
  );
}

function IconLang(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z" />
    </Svg>
  );
}

function IconUsers(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="9" r="3" />
      <circle cx="16.5" cy="10" r="2.4" />
      <path d="M3.5 19c1.2-2.8 3.2-4.2 5.5-4.2S13.3 16.2 14.5 19" />
      <path d="M14 14.8c1.5-.5 3-.4 4.5.7 1.2 1.8 1.6 3.2 1.8 3.5" />
    </Svg>
  );
}

function IconAccess(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="5.5" r="2" />
      <path d="M7 21v-2.5L9.5 11h5L17 18.5V21" />
      <path d="M5.5 14h13" />
    </Svg>
  );
}

function IconSearch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </Svg>
  );
}

function IconJs(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M10 8v7.2c0 1.4-.7 2-1.9 2-.7 0-1.3-.2-1.8-.5" />
      <path d="M13.2 13.6c.4-.7 1.1-1 2-1 1.1 0 1.8.5 1.8 1.3 0 .9-.6 1.3-1.9 1.7l-.7.2c-1.5.5-2.4 1.2-2.4 2.7 0 1.6 1.2 2.5 3 2.5 1.3 0 2.3-.4 3.1-1.2" />
    </Svg>
  );
}

function IconTs(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M7.5 10.5h5.5M10.2 10.5V17" />
      <path d="M14 13.2c.35-.55.95-.85 1.7-.85 1 0 1.65.5 1.65 1.25 0 .85-.55 1.25-1.7 1.6l-.55.18c-1.3.4-2.05 1.05-2.05 2.3 0 1.35 1.05 2.15 2.6 2.15 1.15 0 2-.35 2.7-1" />
    </Svg>
  );
}

function IconNext(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 16V8h1.4l5.2 7.2V8H16v8h-1.4L9.4 8.8V16H8Z" strokeWidth="1.35" />
    </Svg>
  );
}

function IconYoutube(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="m10 9.5 5.5 2.5L10 14.5v-5Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

function IconTheater(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="10" r="4.5" />
      <circle cx="16" cy="10" r="4.5" />
      <path d="M6.2 9.2h.1M9.8 9.2h.1M14.2 9.2h.1M17.8 9.2h.1" strokeWidth="2" />
      <path d="M6.5 12.2c.7.8 1.5 1.2 2.5 1.2s1.8-.4 2.5-1.2M13.5 12.2c.7.8 1.5 1.2 2.5 1.2s1.8-.4 2.5-1.2" />
      <path d="M4.2 14.5c1.2 3 3.2 4.5 5.8 4.5M19.8 14.5c-1.2 3-3.2 4.5-5.8 4.5" />
    </Svg>
  );
}

function IconMic(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="9" y="3.5" width="6" height="10" rx="3" />
      <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3.5M9 20.5h6" />
    </Svg>
  );
}

function IconHeart(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 19.5s-6.5-4.1-8.2-7.6C2.4 9.3 3.6 6.5 6.4 6c1.6-.3 3.1.4 3.9 1.6C11 6.4 12.5 5.7 14.1 6c2.8.5 4 3.3 2.6 5.9C15.1 15.4 12 19.5 12 19.5Z" />
    </Svg>
  );
}

function IconSpark(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6.2 6.2l2.8 2.8M15 15l2.8 2.8M17.8 6.2 15 9M9 15l-2.8 2.8" />
      <circle cx="12" cy="12" r="2.2" />
    </Svg>
  );
}

function IconChat(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 19 15.5H11l-4 3.5v-3.5H5A1.5 1.5 0 0 1 3.5 14V7A1.5 1.5 0 0 1 5 5.5Z" />
    </Svg>
  );
}

function IconCube(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.2 20 7.5v9L12 20.8 4 16.5v-9L12 3.2Z" />
      <path d="M12 12.2 20 7.5M12 12.2v8.6M12 12.2 4 7.5" />
    </Svg>
  );
}

function IconCloud(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7.5 17.5h10a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.7-1.2A3.8 3.8 0 0 0 7.5 17.5Z" />
    </Svg>
  );
}

function IconBranch(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="12" r="2.2" />
      <path d="M6 8.2v7.6M6 12h9.5" />
    </Svg>
  );
}

function IconShield(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.5 19 6.5v5.2c0 4.2-2.9 7.4-7 8.8-4.1-1.4-7-4.6-7-8.8V6.5L12 3.5Z" />
      <path d="m9.2 12 1.9 1.9 3.7-3.8" />
    </Svg>
  );
}

function IconApi(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M8 8h3.5v8H8M14.5 8H18v8h-3.5M10 12h4" />
    </Svg>
  );
}

function IconNet(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="2" />
      <circle cx="5" cy="7" r="1.6" />
      <circle cx="19" cy="7" r="1.6" />
      <circle cx="5" cy="17" r="1.6" />
      <circle cx="19" cy="17" r="1.6" />
      <path d="m6.4 8 4 2.8M13.6 10.8l4-2.8M6.4 16l4-2.8M13.6 13.2l4 2.8" />
    </Svg>
  );
}

const RULES: { test: RegExp; Icon: (p: IconProps) => ReactElement }[] = [
  { test: /typescript|^ts\b/i, Icon: IconTs },
  { test: /javascript|^js\b/i, Icon: IconJs },
  { test: /\bjava\b(?!script)/i, Icon: IconHex },
  { test: /python/i, Icon: IconCode },
  { test: /c#|csharp/i, Icon: IconCode },
  { test: /\bsql\b/i, Icon: IconDb },
  { test: /opengl|webgl|three\.?js/i, Icon: IconCube },
  { test: /angular/i, Icon: IconHex },
  { test: /react/i, Icon: IconAtom },
  { test: /next\.?js/i, Icon: IconNext },
  { test: /node/i, Icon: IconHex },
  { test: /postgres|mysql|mariadb|mongodb|mongo|sql|databases?/i, Icon: IconDb },
  { test: /docker/i, Icon: IconBox },
  { test: /\baws\b|amazon/i, Icon: IconCloud },
  { test: /\bgit\b/i, Icon: IconBranch },
  { test: /n8n/i, Icon: IconNodes },
  { test: /i18n|internacion|mehrsprach/i, Icon: IconLang },
  { test: /rest\s*api|api/i, Icon: IconApi },
  { test: /system\s*design|arquitectura|architektur/i, Icon: IconNet },
  { test: /code\s*review/i, Icon: IconShield },
  { test: /algorithm|algoritm|algorith/i, Icon: IconSpark },
  { test: /network|rede|netzwerk/i, Icon: IconNet },
  { test: /\bai\b|inteligencia|informatik|computer science|ciencias de la comput/i, Icon: IconSpark },
  { test: /software engineering|ingenier[ií]a de software/i, Icon: IconCode },
  { test: /workflow|faq|orquest|orchest|schedul|planificaci[oó]n|planung/i, Icon: IconNodes },
  { test: /tailwind/i, Icon: IconWind },
  {
    test: /portugu|espa[nñ]ol|spanish|englisch|english|ingl[eé]s|alem[aá]n|german|deutsch/i,
    Icon: IconLang,
  },
  { test: /youtube|short video|^short\b/i, Icon: IconYoutube },
  {
    test:
      /big calendar|read-aloud|schedule|stock-manager|turing|cfg|grammar|regua|puzzle|tron|alemsys|vittahub|legacy engine|motor opengl/i,
    Icon: IconBranch,
  },
  { test: /theater|teatro|bühne|stage/i, Icon: IconTheater },
  { test: /public speaking|hablar en p[uú]blico|[öo]ffentliches sprechen|presence|presencia|pr[aä]senz/i, Icon: IconMic },
  {
    test: /communication|comunicaci[oó]n|kommunikation|hablar|speaking(?! )/i,
    Icon: IconChat,
  },
  { test: /empath|escucha|zuh[oö]ren|listening/i, Icon: IconHeart },
  { test: /creativ|kreativ|problem/i, Icon: IconSpark },
  { test: /adapt|anpass|aprendizaje|lernagilit/i, Icon: IconSpark },
  { test: /facilit|conflict|konflikt|colaboraci[oó]n|zusammenarbeit|pressure|druck/i, Icon: IconUsers },
  { test: /pair|mentor|programaci[oó]n en pareja|paarprogramm/i, Icon: IconUsers },
  {
    test: /accesib|inclusiv|zug[aä]nglich|accessible|producto|produkt|product/i,
    Icon: IconAccess,
  },
  { test: /discover|requis|anforder|descubr/i, Icon: IconSearch },
];

export function getSkillIconKey(label: string): string {
  const idx = RULES.findIndex((r) => r.test.test(label));
  return idx >= 0 ? `rule-${idx}` : "default";
}

export function SkillTileIcon({ label, className }: { label: string; className?: string }) {
  const match = RULES.find((r) => r.test.test(label));
  const Icon = match?.Icon ?? IconCode;
  return <Icon className={className} />;
}

/** Até `max` labels com ícones distintos (para stacks nas categorias). */
export function pickSkillPreviewLabels(items: string[], max = 3): string[] {
  const picked: string[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const key = getSkillIconKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(item);
    if (picked.length >= max) return picked;
  }

  for (const item of items) {
    if (picked.length >= max) break;
    if (!picked.includes(item)) picked.push(item);
  }

  return picked;
}
