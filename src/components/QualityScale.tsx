/**
 * Compact 5-segment quality-vs-cost indicator matching the brief builder's priority scale.
 * value: 1 (lower cost) → 5 (top quality)
 */
export function QualityScale({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-2" : "h-4";
  const gap = size === "sm" ? "gap-0.5" : "gap-1";

  const labels = ["Low-cost", "Cost-focused", "Balanced", "Quality-focused", "Top quality"];
  const label = labels[value - 1] || "Balanced";

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${gap}`}>
        {[1, 2, 3, 4, 5].map((v) => (
          <div
            key={v}
            className={`${size === "sm" ? "w-3" : "w-5"} ${h} transition-all ${
              v <= value ? "bg-foreground" : "bg-foreground/10"
            }`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function qualityLabel(value: number): string {
  const labels = ["Low-cost", "Cost-focused", "Balanced", "Quality-focused", "Top quality"];
  return labels[value - 1] || "Balanced";
}
