import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Check, ArrowRight, Upload, X, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useProjects } from "@/lib/projects";
import { useAuth } from "@/lib/auth";

const CATEGORIES = [
  "Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim",
  "Private Label", "Outerwear", "Activewear", "Swimwear", "Leather Goods",
  "Tailoring", "Accessories",
];
// Quality level is now handled by the qualityVsCost scale in the Priorities step
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "PT", name: "Portugal" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
];

const STEPS = ["Your Brand", "What You're Making", "Files & Tech Packs", "Your Priorities", "Review & Submit"];

const MATCHED_VENDORS = [
  { id: 1, name: "Ateliê Nova", region: "PT", category: "Cut & Sew", match: 94 },
  { id: 2, name: "Porto Fleece Works", region: "PT", category: "Fleece", match: 87 },
  { id: 3, name: "Brooklyn Garment Dist.", region: "US", category: "Denim", match: 82 },
];

type SubmitPhase = "matching" | "results";

export default function BriefBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addProjectFromBrief, addDirectProject } = useProjects();
  const { isLoggedIn } = useAuth();
  const vendorName = searchParams.get("vendorName");
  const vendorId = searchParams.get("vendor");

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>("matching");
  const [matchProgress, setMatchProgress] = useState(0);
  const [sentRequests, setSentRequests] = useState<number[]>([]);
  const [form, setForm] = useState({
    labelName: "",
    category: "",
    qualityVsCostLevel: 3,
    quantity: "",
    sampleTimeline: "",
    countries: [] as string[],
    qualityVsCost: 3,
    description: "",
    files: [] as File[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Matching animation — runs 7 seconds then reveals results
  useEffect(() => {
    if (!submitted || submitPhase !== "matching") return;
    const duration = 7000;
    const interval = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setMatchProgress(progress);
      if (elapsed >= duration) {
        clearInterval(timer);
        setSubmitPhase("results");
      }
    }, interval);
    return () => clearInterval(timer);
  }, [submitted, submitPhase]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Lock className="h-6 w-6 mx-auto mb-4 text-muted-foreground/40" />
          <h1 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight mb-2">Sign up to continue</h1>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-6">
            Join Threadline to build project briefs and connect with manufacturers.
          </p>
          <Link to="/join">
            <Button variant="editorial" size="lg">
              Join Threadline <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleCountry = (code: string) => {
    setForm((f) => ({
      ...f,
      countries: f.countries.includes(code) ? f.countries.filter((c) => c !== code) : [...f.countries, code],
    }));
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((f) => ({ ...f, files: [...f.files, ...Array.from(e.target.files!)] }));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setForm((f) => ({ ...f, files: f.files.filter((_, i) => i !== index) }));
  };

  const briefData = {
    labelName: form.labelName,
    category: form.category,
    qualityVsCost: form.qualityVsCost,
    quantity: form.quantity,
    description: form.description,
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setSubmitPhase("matching");
    setMatchProgress(0);

    // If submitting directly to a named vendor, create the project immediately
    if (vendorName) {
      addDirectProject(vendorName, briefData);
    }
  };


  const handleSendRequest = (vendor: typeof MATCHED_VENDORS[0]) => {
    addProjectFromBrief(vendor, briefData);
    setSentRequests((prev) => [...prev, vendor.id]);
  };

  const allRequestsSent = !vendorName && sentRequests.length > 0;

  // MATCHING PHASE
  if (submitted && submitPhase === "matching") {
    return (
      <div>
        <section className="border-b border-foreground/10">
          <div className="container py-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
              {vendorName ? `Sending to ${vendorName}` : "Finding Your Matches"}
            </p>
            <h1 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight">
              {vendorName ? "Submitting Your Project…" : "Matching You with Manufacturers…"}
            </h1>
          </div>
        </section>
        <section className="container max-w-lg py-20">
          <div className="space-y-6">
            <Progress value={matchProgress} className="h-1 bg-foreground/10 [&>div]:bg-foreground" />
            <div className="space-y-2">
              <p className="font-body text-sm text-foreground/80 text-center">
                {matchProgress < 30 && "Analyzing your project details…"}
                {matchProgress >= 30 && matchProgress < 60 && "Scanning manufacturer capabilities…"}
                {matchProgress >= 60 && matchProgress < 90 && "Calculating compatibility scores…"}
                {matchProgress >= 90 && "Finalizing your matches…"}
              </p>
              <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider text-center">
                {Math.round(matchProgress)}%
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // RESULTS PHASE — after matching
  if (submitted && submitPhase === "results") {
    return (
      <div>
        <section className="border-b border-foreground/10">
          <div className="container py-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-signal flex items-center justify-center">
                <Check className="h-4 w-4 text-signal-foreground" />
              </div>
              <h1 className="font-display text-2xl font-800 uppercase tracking-tight">
                {vendorName ? "Project Submitted!" : "Your Matches Are Ready"}
              </h1>
            </div>
            <p className="font-body text-sm text-muted-foreground max-w-md">
              {vendorName
                ? `Your project has been sent to ${vendorName}. They'll review it and get back to you soon.`
                : "We found manufacturers that are a great fit. Send them a request to get started."}
            </p>
          </div>
        </section>

        <section className="container py-10 max-w-2xl">
          {!vendorName && (
            <>
              <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-6">Your Top Matches</h2>
              <div className="flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10 mb-6">
                {MATCHED_VENDORS.map((v) => {
                  const isSent = sentRequests.includes(v.id);
                  return (
                    <div key={v.id} className="py-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-body text-sm font-600">{v.name}</h3>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                          {v.category} · {v.region}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-600 text-signal">{v.match}% match</span>
                        {isSent ? (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Check className="h-3 w-3 text-signal" /> Request Sent
                          </span>
                        ) : (
                          <Button
                            variant="editorial"
                            size="sm"
                            onClick={() => handleSendRequest(v)}
                          >
                            Send Request <ArrowUpRight className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <p className="font-body text-sm text-muted-foreground mb-2">What happens next?</p>
          <ul className="space-y-2 mb-6">
            <li className="font-body text-sm text-foreground/80">• Manufacturers will review your project and respond within 48 hours</li>
            <li className="font-body text-sm text-foreground/80">• You'll get a notification when they reply</li>
            <li className="font-body text-sm text-foreground/80">• You can message them directly from your Workbench</li>
          </ul>

          {(vendorName || allRequestsSent) && (
            <Link to="/workbench">
              <Button variant="editorial" size="lg">
                Go to Your Workbench <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          )}
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
          <div className="flex items-center gap-0 flex-wrap">
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
              <BriefField label="How many units do you need?" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} placeholder="e.g. 200–500 (it's okay to estimate)" />
              <BriefField label="When do you need samples by?" value={form.sampleTimeline} onChange={(v) => setForm({ ...form, sampleTimeline: v })} placeholder="e.g. 4 weeks, no rush, ASAP" />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-1">Files & Tech Packs</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Upload any files that help describe your product — tech packs, sketches, reference images, fabric swatches, or mood boards. This is optional but helps manufacturers give you an accurate quote faster.
              </p>
              <input ref={fileInputRef} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.ai,.eps,.svg,.doc,.docx,.xls,.xlsx" onChange={handleFileAdd} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-foreground/20 hover:border-foreground/40 transition-colors p-8 flex flex-col items-center gap-3 group"
              >
                <Upload className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="font-body text-sm text-muted-foreground group-hover:text-foreground transition-colors">Click to upload files</span>
                <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider">PDF, images, AI, EPS, DOC — up to 20MB each</span>
              </button>
              {form.files.length > 0 && (
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block">Uploaded Files ({form.files.length})</span>
                  {form.files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border border-foreground/10 bg-muted/30">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-body text-sm truncate">{file.name}</p>
                          <p className="font-mono text-[10px] text-muted-foreground/50 uppercase">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button onClick={() => removeFile(i)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-1">Your Priorities</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">Help us understand what matters most to you so we can find the best match.</p>
              {!vendorId && (
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">Any preference on where it's made?</span>
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
                  <p className="font-mono text-[10px] text-muted-foreground/60 mt-1.5">Skip this if you don't have a preference — we'll match you with the best options anywhere.</p>
                </div>
              )}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-3">What's more important — keeping costs low or getting the highest quality?</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider w-20 text-right">Lower cost</span>
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button key={v} onClick={() => setForm({ ...form, qualityVsCost: v })} className={`flex-1 h-8 transition-all ${v <= form.qualityVsCost ? "bg-foreground" : "bg-foreground/10"}`} />
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider w-20">Top quality</span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground/60 mt-2 text-center">
                  {[undefined, "Got it — we'll find the most affordable manufacturers available.", "Got it — we'll focus on cost-effective manufacturers who still meet quality standards.", "A good balance — solid quality at a reasonable price point.", "Got it — we'll prioritize manufacturers known for exceptional quality and craftsmanship.", "Got it — we'll match you with top-tier manufacturers offering the highest quality available."][form.qualityVsCost]}
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-1">Review Your Project</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">Take a quick look — you can always go back and change things.</p>
              <div className="border border-foreground/10 divide-y divide-foreground/10">
                {vendorName && <ReviewRow label="Manufacturer" value={vendorName} />}
                <ReviewRow label="Brand" value={form.labelName || "—"} />
                <ReviewRow label="Product Type" value={form.category || "—"} />
                <ReviewRow label="Quality Priority" value={qualityLabel(form.qualityVsCost)} />
                <ReviewRow label="Quantity" value={form.quantity || "—"} />
                <ReviewRow label="Sample Timeline" value={form.sampleTimeline || "—"} />
                <ReviewRow label="Files" value={form.files.length > 0 ? `${form.files.length} file${form.files.length > 1 ? "s" : ""} attached` : "None"} />
                {!vendorId && <ReviewRow label="Location Preference" value={form.countries.join(", ") || "No preference"} />}
                <ReviewRow label="Priority" value={qualityLabel(form.qualityVsCost)} />
              </div>
              <p className="font-body text-xs text-muted-foreground mt-2">
                {vendorName
                  ? `When you submit, ${vendorName} will be notified and can start reviewing your project right away.`
                  : "When you submit, we'll automatically match you with manufacturers that fit your needs."}
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-foreground/10">
            {step > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>← Back</Button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <Button variant="editorial" size="lg" onClick={() => setStep(step + 1)}>Continue</Button>
            ) : (
              <Button variant="signal" size="lg" onClick={handleSubmit}>
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
