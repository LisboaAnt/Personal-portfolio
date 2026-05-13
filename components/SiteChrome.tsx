import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SecretYear } from "@/components/SecretYear";
import { ThemeToggle } from "@/components/ThemeToggle";

const link =
  "rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]";

export async function SiteChrome({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "Nav" });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight text-[var(--foreground)]">
            Antonio Lisboa
          </Link>
          <nav className="flex flex-1 items-center justify-end gap-0.5 sm:justify-center sm:gap-2" aria-label={t("aria")}>
            <Link href="/" className={link}>
              {t("home")}
            </Link>
            <Link href="/work" className={link}>
              {t("work")}
            </Link>
            <Link href="/lab" className={link}>
              {t("lab")}
            </Link>
            <Link href="/#contact" className={link}>
              {t("contact")}
            </Link>
          </nav>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]/60 py-8 text-center text-xs text-[var(--muted)] backdrop-blur-sm">
        <div className="mx-auto max-w-5xl space-y-2 px-4 sm:px-6">
          <p>
            © <SecretYear label={t("yearSecretAria")} /> · {t("footerTagline")}
          </p>
          <p className="flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--foreground)]">
              Next.js 16
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--foreground)]">
              React 19
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--foreground)]">
              TypeScript
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--foreground)]">
              Tailwind v4
            </span>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)]/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--foreground)]">
              next-intl
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
