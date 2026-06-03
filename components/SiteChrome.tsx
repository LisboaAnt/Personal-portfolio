import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SecretYear } from "@/components/SecretYear";
import { WorldNav } from "@/components/world/WorldNav";
import { WorldOverlay } from "@/components/world/WorldOverlay";

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
      <div className="sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-5xl justify-end px-2 sm:px-6">
          <header className="site-chrome-header flex h-8 min-w-0 max-w-full items-center gap-1 rounded-b-xl border border-t-0 border-[var(--border)] bg-[var(--surface)]/80 px-1.5 shadow-[0_6px_20px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:h-9 sm:max-w-2xl sm:gap-2 sm:rounded-b-2xl sm:px-2.5">
            <WorldNav />
            <div className="flex shrink-0 items-center border-l border-[var(--border)]/60 pl-1 sm:pl-1.5">
              <LocaleSwitcher />
            </div>
          </header>
        </div>
      </div>

      <WorldOverlay>
        <div className="flex-1">{children}</div>
      </WorldOverlay>

      <footer className="site-chrome-footer relative z-50 mt-auto border-t border-[var(--border)] bg-[var(--surface)]/60 py-8 text-center text-xs text-[var(--muted)] backdrop-blur-sm">
        <div className="mx-auto max-w-5xl space-y-2 px-4 sm:px-6">
          <p>
            © <SecretYear label={t("yearSecretAria")} /> · {t("footerTagline")}
          </p>
          <p className="hidden flex-wrap items-center justify-center gap-2 sm:flex">
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
