"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import styles from "./locale-switcher.module.css";

type Locale = (typeof routing.locales)[number];

const localeOptions: { locale: Locale; flag: string }[] = [
  { locale: "en", flag: "/img/FlagUS.svg" },
  { locale: "es", flag: "/img/FlagSpain.svg" },
  { locale: "de", flag: "/img/FlagGermany.svg" },
];

function Flag({
  src,
  className,
  width,
  height,
}: {
  src: string;
  className: string;
  width: number;
  height: number;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      className={`${styles.flag} ${className}`}
    />
  );
}

function DesktopSwitcher({
  locale,
  onChange,
  languageAria,
  localeName,
}: {
  locale: Locale;
  onChange: (next: Locale) => void;
  languageAria: string;
  localeName: (code: Locale) => string;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [hovered, setHovered] = useState<Locale | null>(null);

  const current = localeOptions.find((o) => o.locale === locale);
  const others = localeOptions.filter((o) => o.locale !== locale);

  return (
    <div
      className={`${styles.container} ${styles.desktop}`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => {
        setShowOptions(false);
        setHovered(null);
      }}
      role="group"
      aria-label={languageAria}
    >
      <div className={styles.main}>
        {current ? (
          <button
            type="button"
            className={styles.option}
            onClick={() => setShowOptions((v) => !v)}
            aria-label={localeName(current.locale)}
            aria-expanded={showOptions}
          >
            <Flag src={current.flag} className={styles.mainImage} width={29} height={19} />
          </button>
        ) : null}
      </div>

      <div className={`${styles.options} ${showOptions ? styles.optionsShow : ""}`}>
        {others.map((option) => (
          <button
            key={option.locale}
            type="button"
            className={styles.option}
            onClick={() => {
              onChange(option.locale);
              setShowOptions(false);
            }}
            onMouseEnter={() => setHovered(option.locale)}
            onMouseLeave={() => setHovered(null)}
            aria-label={localeName(option.locale)}
          >
            <Flag src={option.flag} className={styles.optionImage} width={26} height={17} />
            {hovered === option.locale ? (
              <div className={styles.tooltip}>
                <span>{localeName(option.locale)}</span>
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function MobileSwitcher({
  locale,
  onChange,
  languageAria,
  localeName,
}: {
  locale: Locale;
  onChange: (next: Locale) => void;
  languageAria: string;
  localeName: (code: Locale) => string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = localeOptions.find((o) => o.locale === locale);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.mobile}>
      <button
        type="button"
        className={`${styles.mobileTrigger} ${open ? styles.mobileTriggerOpen : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={languageAria}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {current ? (
          <Flag src={current.flag} className={styles.dropdownFlag} width={26} height={17} />
        ) : null}
        <svg
          className={`${styles.mobileChevron} ${open ? styles.mobileChevronOpen : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open ? (
        <ul className={styles.dropdown} role="listbox" aria-label={languageAria}>
          {localeOptions.map((option) => (
            <li key={option.locale} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={option.locale === locale}
                className={`${styles.dropdownItem} ${
                  option.locale === locale ? styles.dropdownItemActive : ""
                }`}
                onClick={() => {
                  onChange(option.locale);
                  setOpen(false);
                }}
              >
                <Flag src={option.flag} className={styles.dropdownFlag} width={26} height={17} />
                <span>{localeName(option.locale)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Locale");
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const localeName = (code: Locale) => t(`names.${code}`);

  const changeLocale = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <>
      <DesktopSwitcher
        locale={locale}
        onChange={changeLocale}
        languageAria={t("aria")}
        localeName={localeName}
      />
      <MobileSwitcher
        locale={locale}
        onChange={changeLocale}
        languageAria={t("aria")}
        localeName={localeName}
      />
    </>
  );
}
