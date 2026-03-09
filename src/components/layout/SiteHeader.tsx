import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ArrowUpRight, MessageSquare, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorActions } from "@/lib/vendors";
import { useAuth } from "@/lib/auth";

const primaryNav = [
  { label: "Explore Vendors", path: "/vendors" },
  { label: "Build Brief", path: "/brief" },
  { label: "Workbench", path: "/workbench" },
  { label: "How It Works", path: "/how-it-works" },
  { label: "Concierge", path: "/concierge" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { savedIds } = useVendorActions();
  const { isLoggedIn, userName, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="font-display font-800 text-lg tracking-[0.2em] uppercase">
          THREADLINE
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {primaryNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-mono text-xs uppercase tracking-widest transition-colors hover:text-signal ${
                location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/manufacturers"
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground transition-colors"
          >
            For Manufacturers
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {savedIds.length > 0 && (
            <Link to="/saved">
              <Button variant="ghost" size="icon" className="relative">
                <Bookmark className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-signal text-signal-foreground text-[9px] font-mono flex items-center justify-center">
                  {savedIds.length}
                </span>
              </Button>
            </Link>
          )}
          <Link to="/messages">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-signal" />
            </Button>
          </Link>
          <Link to="/join">
            <Button variant="editorial" size="sm">
              Join <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-foreground/10 bg-background">
          <nav className="container py-6 flex flex-col gap-4">
            {primaryNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="font-display text-2xl font-bold uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/saved"
              onClick={() => setMobileOpen(false)}
              className="font-display text-2xl font-bold uppercase tracking-wide flex items-center gap-2"
            >
              Saved {savedIds.length > 0 && <span className="font-mono text-sm text-signal">{savedIds.length}</span>}
            </Link>
            <Link
              to="/messages"
              onClick={() => setMobileOpen(false)}
              className="font-display text-2xl font-bold uppercase tracking-wide flex items-center gap-2"
            >
              Messages <span className="w-2 h-2 bg-signal" />
            </Link>
            <div className="divider-editorial my-2" />
            <Link
              to="/manufacturers"
              onClick={() => setMobileOpen(false)}
              className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
            >
              For Manufacturers
            </Link>
            <Link to="/join" onClick={() => setMobileOpen(false)}>
              <Button variant="editorial" size="lg" className="w-full mt-2">
                Join Threadline
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
