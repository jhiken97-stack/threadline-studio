import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const primaryNav = [
  { label: "Explore Vendors", path: "/vendors" },
  { label: "Build Brief", path: "/brief" },
  { label: "Workbench", path: "/workbench" },
  { label: "How It Works", path: "/how-it-works" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
      <div className="container flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="font-display font-800 text-lg tracking-[0.2em] uppercase">
          THREADLINE
        </Link>

        {/* Desktop nav */}
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

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/join">
            <Button variant="editorial" size="sm">
              Join <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
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
