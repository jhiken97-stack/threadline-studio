import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function Join() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-signal flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-signal-foreground" />
          </div>
          <h1 className="font-display text-3xl font-800 uppercase tracking-tight mb-2">You're in.</h1>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Full vendor intelligence is now unlocked.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md mx-auto px-6 py-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Join Threadline</p>
        <h1 className="font-display text-3xl md:text-4xl font-800 uppercase tracking-tight leading-[0.95] mb-2">
          Unlock full vendor
          <br />
          intelligence.
        </h1>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-8">
          Production-fit data. MOQ bands. Lead times. Contact details.
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="flex flex-col gap-4"
        >
          <FormField label="Label Name" name="label" placeholder="Your brand / label name" />
          <FormField label="Email" name="email" type="email" placeholder="you@yourlabel.com" />
          <FormField label="Role" name="role" placeholder="Founder, Head of Production, etc." />

          <Button type="submit" variant="editorial" size="lg" className="w-full mt-2">
            Get Access <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </form>

        <p className="font-mono text-[9px] text-muted-foreground/50 uppercase tracking-wider mt-6 text-center">
          No credit card required · Instant access
        </p>
      </div>
    </div>
  );
}

function FormField({ label, name, type = "text", placeholder }: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );
}
