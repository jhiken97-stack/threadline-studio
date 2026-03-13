import { Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, FileText, FolderKanban, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useVendorAuth } from "@/lib/vendor-auth";

const navItems = [
  { label: "Dashboard", path: "/vendor", icon: LayoutDashboard },
  { label: "Briefs", path: "/vendor/briefs", icon: FileText },
  { label: "Projects", path: "/vendor/projects", icon: FolderKanban },
  { label: "Profile", path: "/vendor/profile", icon: User },
];

export function VendorLayout({ children }: { children: React.ReactNode }) {
  const { isVendorLoggedIn, vendorProfile, vendorLogout } = useVendorAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isVendorLoggedIn) {
    return <Navigate to="/vendor/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r border-foreground/10 bg-card fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-foreground/10">
          <Link to="/" className="font-display font-800 text-sm tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            THREADLINE
          </Link>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-signal mt-1">Vendor Portal</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== "/vendor" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-foreground/10">
          <p className="font-body text-xs font-600 truncate">{vendorProfile.factoryName}</p>
          <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{vendorProfile.region}</p>
          <button
            onClick={vendorLogout}
            className="flex items-center gap-2 mt-3 font-mono text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-wider transition-colors"
          >
            <LogOut className="h-3 w-3" /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-foreground/10 h-14 flex items-center justify-between px-4">
        <div>
          <span className="font-display font-800 text-sm tracking-[0.2em] uppercase">THREADLINE</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-signal ml-2">Vendor</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-14">
          <nav className="p-6 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-wider ${
                    active ? "bg-foreground text-background" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="divider-editorial my-4" />
            <button
              onClick={() => { vendorLogout(); setMobileOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 font-mono text-xs text-muted-foreground uppercase tracking-wider"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
