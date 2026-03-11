import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface BuyerProtectionBadgeProps {
  variant?: "inline" | "block" | "minimal";
  className?: string;
}

export function BuyerProtectionBadge({ variant = "inline", className = "" }: BuyerProtectionBadgeProps) {
  if (variant === "minimal") {
    return (
      <Link
        to="/buyer-protection"
        className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-signal hover:text-signal/80 transition-colors ${className}`}
      >
        <ShieldCheck className="h-3 w-3" /> Protected
      </Link>
    );
  }

  if (variant === "block") {
    return (
      <Link to="/buyer-protection" className={`block p-4 border border-signal/20 bg-signal/5 hover:bg-signal/10 transition-colors ${className}`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-signal flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-body text-sm font-600 mb-0.5">Buyer Protection Included</h4>
            <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
              Your payment is held in escrow until confirmed delivery. Quality guarantee &amp; dispute resolution included.
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // inline (default)
  return (
    <Link
      to="/buyer-protection"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border border-signal/20 bg-signal/5 hover:bg-signal/10 transition-colors ${className}`}
    >
      <ShieldCheck className="h-3.5 w-3.5 text-signal" />
      <span className="font-mono text-[10px] uppercase tracking-wider text-signal">Buyer Protection</span>
    </Link>
  );
}
