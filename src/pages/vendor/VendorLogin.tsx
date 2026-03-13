import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorAuth } from "@/lib/vendor-auth";

export default function VendorLogin() {
  const [name, setName] = useState("");
  const { vendorLogin, isVendorLoggedIn } = useVendorAuth();
  const navigate = useNavigate();

  if (isVendorLoggedIn) {
    navigate("/vendor", { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    vendorLogin(name.trim());
    navigate("/vendor");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="font-display font-800 text-lg tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            THREADLINE
          </Link>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-signal mt-1">Vendor Portal</p>
        </div>

        <h1 className="font-display text-2xl font-800 uppercase tracking-tight mb-1">Vendor Login</h1>
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-8">
          Access your dashboard, manage briefs, and track projects
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
              Factory / Company Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your factory name"
              className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="contact@factory.com"
              className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <Button type="submit" variant="editorial" size="lg" className="w-full">
            Sign In <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </form>

        <p className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-wider text-center mt-8">
          Not a vendor? <Link to="/join" className="text-signal hover:text-signal/80 transition-colors">Join as a brand</Link>
        </p>
      </div>
    </div>
  );
}
