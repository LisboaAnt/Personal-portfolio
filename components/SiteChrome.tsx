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
        <WorldCvScrollRoot>{children}</WorldCvScrollRoot>
      </WorldOverlay>

      <SiteChromeFooterGate>
        <SiteFooter locale={locale} />
      </SiteChromeFooterGate>
    </div>
  );
}
