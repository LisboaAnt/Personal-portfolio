import { getTranslations } from "next-intl/server";
import { SecretYear } from "@/components/SecretYear";

type Props = {
  locale: string;
  variant?: "chrome" | "inline";
};

export async function SiteFooter({ locale, variant = "chrome" }: Props) {
  const t = await getTranslations({ locale, namespace: "Nav" });

  if (variant === "inline") {
    return (
      <footer className="cv-contact-footer mt-8 border-t border-[var(--border)]/70 pt-6 text-center text-xs text-[var(--muted)]">
        <p>
          © <SecretYear label={t("yearSecretAria")} /> · {t("footerTagline")}
        </p>
      </footer>
    );
  }

  return (
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
  );
}
