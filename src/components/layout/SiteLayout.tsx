import { SiteHeader } from "./SiteHeader";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-14">{children}</main>
      <footer className="border-t border-foreground/10 bg-background">
        <div className="container py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="font-display font-800 text-sm tracking-[0.2em] uppercase">THREADLINE</span>
            <p className="font-mono text-[10px] text-muted-foreground mt-1 tracking-wide">
              Manufacturing discovery for independent labels
            </p>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground tracking-wide">
            THREADLINE — © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
