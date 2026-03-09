import { useState } from "react";
import { ArrowUpRight, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";

const CATEGORIES = ["Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim", "Private Label"];
const TIERS = ["Premium", "Luxury"];
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "PT", name: "Portugal" },
  { code: "CN", name: "China" },
];

const STEPS = ["Your Brand", "What You're Making", "Your Priorities", "Review & Submit"];

const MATCHED_VENDORS = [
  { name: "Ateliê Nova", region: "PT", category: "Cut & Sew", match: 94 },
  { name: "Porto Fleece Works", region: "PT", category: "Fleece", match: 87 },
  { name: "Brooklyn Garment Dist.", region: "US", category: "Denim", match: 82 },
];

export default function BriefBuilder() {
  const [searchParams] = useSearchParams();
  const vendorName = searchParams.get("vendorName");
  const vendorId = searchParams.get("vendor");

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    labelName: "",
    category: "",
    tier: "",
    quantity: "",
    sampleTimeline: "",
    countries: [] as string[],
    qualityVsCost: 3,
    description: "",
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
              <h1 className="font-display text-2xl font-800 uppercase tracking-tight">You're all set!</h1>
            </div>
            <p className="font-body text-sm text-muted-foreground max-w-md">
              {vendorName
                ? `Your project has been sent to ${vendorName}. They'll review it and get back to you soon.`
                : "We're matching you with manufacturers who are a great fit for your project."
              }
            </p>
          </div>
        </section>

        <section className="container py-10 max-w-2xl">
          {!vendorName && (
            <>
              <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-6">Your Top Matches</h2>
              <div className="flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10 mb-6">
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
            </>
          )}
          <p className="font-body text-sm text-muted-foreground mb-2">What happens next?</p>
          <ul className="space-y-2 mb-6">
            <li className="font-body text-sm text-foreground/80">• Manufacturers will review your project and respond within 48 hours</li>
            <li className="font-body text-sm text-foreground/80">• You'll get a notification when they reply</li>
            <li className="font-body text-sm text-foreground/80">• You can message them directly from your Workbench</li>
          </ul>
          <Link to="/workbench">
            <Button variant="editorial" size="lg">
              Go to Your Workbench <ArrowRight className="ml-1 h-4 w-4" />
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
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
            {vendorName ? `Project for ${vendorName}` : "Start a New Project"}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-800 uppercase tracking-tight">
            {vendorName ? "Submit Your Project" : "Tell Us What You Want to Make"}
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-lg">
            Don't worry if you don't have all the details yet — just share what you know and we'll help you figure out the rest.
          </p>
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
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-1">About Your Brand</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Whether you're just starting out or already selling — tell us a bit about your brand.
              </p>
              <BriefField label="Brand or Label Name" value={form.labelName} onChange={(v) => setForm({ ...form, labelName: v })} placeholder="e.g. My Clothing Brand" />
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                  Describe your project (optional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell us about your idea — what are you trying to create? Who is it for?"
                  rows={3}
                  className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-1">What Are You Making?</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Pick the category that best describes your product. Not sure? Just pick the closest one — you can change it later.
              </p>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Product Type</span>
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
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                  Quality Level
                </span>
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
                <p className="font-mono text-[10px] text-muted-foreground/60 mt-1.5">
                  Premium = great quality, lower MOQs. Luxury = highest-end materials and construction.
                </p>
              </div>
              <BriefField label="How many units do you need?" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} placeholder="e.g. 200–500 (it's okay to estimate)" />
              <BriefField label="When do you need samples by?" value={form.sampleTimeline} onChange={(v) => setForm({ ...form, sampleTimeline: v })} placeholder="e.g. 4 weeks, no rush, ASAP" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-1">Your Priorities</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Help us understand what matters most to you so we can find the best match.
              </p>
              
              {/* Countries */}
              {!vendorId && (
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">
                    Any preference on where it's made?
                  </span>
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
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-1.5">
                    Skip this if you don't have a preference — we'll match you with the best options anywhere.
                  </p>
                </div>
              )}

              {/* Quality vs Cost slider */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">
                  What's more important — keeping costs low or getting the highest quality?
                </span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider w-20 text-right">Lower cost</span>
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
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider w-20">Top quality</span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/60 mt-2 text-center">
                  {form.qualityVsCost <= 2
                    ? "Got it — we'll focus on cost-effective manufacturers who still meet quality standards."
                    : form.qualityVsCost >= 4
                    ? "Got it — we'll prioritize manufacturers known for exceptional quality and craftsmanship."
                    : "A good balance — solid quality at a reasonable price point."}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-1">Review Your Project</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Take a quick look — you can always go back and change things.
              </p>
              <div className="border border-foreground/10 divide-y divide-foreground/10">
                {vendorName && <ReviewRow label="Manufacturer" value={vendorName} />}
                <ReviewRow label="Brand" value={form.labelName || "—"} />
                <ReviewRow label="Product Type" value={form.category || "—"} />
                <ReviewRow label="Quality Level" value={form.tier || "—"} />
                <ReviewRow label="Quantity" value={form.quantity || "—"} />
                <ReviewRow label="Sample Timeline" value={form.sampleTimeline || "—"} />
                {!vendorId && <ReviewRow label="Location Preference" value={form.countries.join(", ") || "No preference"} />}
                <ReviewRow label="Priority" value={form.qualityVsCost <= 2 ? "Cost-focused" : form.qualityVsCost >= 4 ? "Quality-focused" : "Balanced"} />
              </div>
              <p className="font-body text-xs text-muted-foreground mt-2">
                {vendorName
                  ? `When you submit, ${vendorName} will be notified and can start reviewing your project right away.`
                  : "When you submit, we'll automatically match you with manufacturers that fit your needs."
                }
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
                {vendorName ? `Submit to ${vendorName}` : "Submit & Get Matched"} <ArrowUpRight className="ml-1 h-4 w-4" />
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
