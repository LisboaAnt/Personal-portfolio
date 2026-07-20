import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SiteChromeFooterGate } from "@/components/SiteChromeFooterGate";
import { SiteFooter } from "@/components/SiteFooter";
import { WorldCvScrollRoot } from "@/components/cv/WorldCvScrollRoot";
import { WorldNav } from "@/components/world/WorldNav";
import { WorldOverlay } from "@/components/world/WorldOverlay";

export async function SiteChrome({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <div className="site-chrome-shell flex min-h-dvh flex-col">
      <div className="site-chrome-header-slot">
        <div className="site-chrome-bar mx-auto flex w-full max-w-none justify-stretch px-0 sm:max-w-5xl sm:justify-end sm:px-6">
          <header className="site-chrome-header flex h-10 w-full min-w-0 max-w-none items-center gap-1 rounded-none border border-x-0 border-t-0 border-[var(--border)] bg-[var(--surface)]/80 px-2 shadow-[0_6px_20px_rgba(0,0,0,0.16)] backdrop-blur-xl sm:h-9 sm:max-w-2xl sm:gap-2 sm:rounded-b-2xl sm:border-x sm:px-2.5">
            <WorldNav />
            <div className="site-chrome-header__locale-divider flex shrink-0 items-center border-l border-[var(--border)]/60 pl-1.5 sm:pl-1.5">
              <LocaleSwitcher />
            </div>
          </header>
        </div>
      </div>

      <WorldOverlay>
        <WorldCvScrollRoot>{children}</WorldCvScrollRoot>
      </WorldOverlay>

      <SiteChromeFooterGate>
        <SiteFooter locale={locale} />
      </SiteChromeFooterGate>
    </div>
  );
}
