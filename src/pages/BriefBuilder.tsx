import { useState } from "react";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CATEGORIES = ["Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim", "Private Label"];
const TIERS = ["Premium", "Luxury"];
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "PT", name: "Portugal" },
  { code: "CN", name: "China" },
];

const STEPS = ["Details", "Specs", "Priorities", "Review"];

const MATCHED_VENDORS = [
  { name: "Ateliê Nova", region: "PT", category: "Cut & Sew", match: 94 },
  { name: "Porto Fleece Works", region: "PT", category: "Fleece", match: 87 },
  { name: "Brooklyn Garment Dist.", region: "US", category: "Denim", match: 82 },
];

export default function BriefBuilder() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    labelName: "",
    category: "",
    tier: "",
    quantity: "",
    sampleTimeline: "",
    countries: [] as string[],
    qualityVsCost: 3, // 1=cost-focused, 5=quality-focused
  });

  const toggleCountry = (code: string) => {
    setForm((f) => ({
      ...f,
      countries: f.countries.includes(code) ? f.countries.filter((c) => c !== code) : [...f.countries, code],
    }));
  };

  if (submitted) {
    return (
      <div>
        <section className="border-b border-foreground/10">
          <div className="container py-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-signal flex items-center justify-center">
                <Check className="h-4 w-4 text-signal-foreground" />
              </div>
              <h1 className="font-display text-2xl font-800 uppercase tracking-tight">Brief Submitted</h1>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              We're matching you with manufacturers based on your requirements.
            </p>
          </div>
        </section>

        <section className="container py-10 max-w-2xl">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-6">Matched Manufacturers</h2>
          <div className="flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10">
            {MATCHED_VENDORS.map((v) => (
              <div key={v.name} className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-body text-sm font-600">{v.name}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{v.category} · {v.region}</p>
                </div>
                <span className="font-mono text-xs font-600 text-signal">{v.match}% match</span>
              </div>
            ))}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-4">
            Vendors have been notified and will respond within 48 hours.
          </p>
          <Link to="/workbench">
            <Button variant="editorial" size="lg" className="mt-6">
              Go to Workbench <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Production Tool</p>
          <h1 className="font-display text-3xl md:text-4xl font-800 uppercase tracking-tight">Build Your Brief</h1>
        </div>
      </section>

      {/* Progress */}
      <section className="border-b border-foreground/10">
        <div className="container py-4">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => setStep(i)}
                  className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all ${
                    i === step ? "bg-foreground text-background" : i < step ? "text-foreground" : "text-muted-foreground/40"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} {s}
                </button>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-foreground/15" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section>
        <div className="container max-w-2xl py-10">
          {step === 0 && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-4">Label Details</h2>
              <BriefField label="Label / Brand Name" value={form.labelName} onChange={(v) => setForm({ ...form, labelName: v })} placeholder="Your brand name" />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-4">Product Specs</h2>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Category</span>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setForm({ ...form, category: cat })}
                      className={`font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider transition-all ${
                        form.category === cat ? "bg-foreground text-background" : "border border-foreground/20 hover:border-foreground/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Quality Tier</span>
                <div className="flex gap-2">
                  {TIERS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, tier: t })}
                      className={`font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider transition-all ${
                        form.tier === t ? "bg-foreground text-background" : "border border-foreground/20 hover:border-foreground/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <BriefField label="Target Quantity" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} placeholder="e.g. 200–500 units" />
              <BriefField label="Sample Timeline" value={form.sampleTimeline} onChange={(v) => setForm({ ...form, sampleTimeline: v })} placeholder="e.g. 4 weeks" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-4">Priorities</h2>
              
              {/* Countries */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Preferred Countries</span>
                <div className="flex gap-2">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => toggleCountry(c.code)}
                      className={`font-mono text-[10px] px-4 py-2.5 uppercase tracking-wider transition-all ${
                        form.countries.includes(c.code) ? "bg-foreground text-background" : "border border-foreground/20 hover:border-foreground/40"
                      }`}
                    >
                      {c.code} — {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality vs Cost slider */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">Quality vs. Cost Priority</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider w-16 text-right">Cost</span>
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => setForm({ ...form, qualityVsCost: v })}
                        className={`flex-1 h-8 transition-all ${
                          v <= form.qualityVsCost ? "bg-foreground" : "bg-foreground/10"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider w-16">Quality</span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/60 mt-2 text-center">
                  {form.qualityVsCost <= 2 ? "You'll be matched with cost-efficient manufacturers." : form.qualityVsCost >= 4 ? "You'll be matched with premium-quality manufacturers." : "Balanced — good quality at reasonable cost."}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-4">Review Brief</h2>
              <div className="border border-foreground/10 divide-y divide-foreground/10">
                <ReviewRow label="Label" value={form.labelName || "—"} />
                <ReviewRow label="Category" value={form.category || "—"} />
                <ReviewRow label="Tier" value={form.tier || "—"} />
                <ReviewRow label="Quantity" value={form.quantity || "—"} />
                <ReviewRow label="Timeline" value={form.sampleTimeline || "—"} />
                <ReviewRow label="Countries" value={form.countries.join(", ") || "—"} />
                <ReviewRow label="Priority" value={form.qualityVsCost <= 2 ? "Cost-focused" : form.qualityVsCost >= 4 ? "Quality-focused" : "Balanced"} />
              </div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                Submitting will automatically match you with relevant manufacturers.
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-foreground/10">
            {step > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                ← Back
              </Button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <Button variant="editorial" size="lg" onClick={() => setStep(step + 1)}>
                Continue
              </Button>
            ) : (
              <Button variant="signal" size="lg" onClick={() => setSubmitted(true)}>
                Submit & Match <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function BriefField({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-body text-sm font-500">{value}</span>
    </div>
  );
}
