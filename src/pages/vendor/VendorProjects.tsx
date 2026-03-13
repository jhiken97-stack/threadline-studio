import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare, Package, Truck, CheckCircle2, Check, Circle, Clock, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorAuth } from "@/lib/vendor-auth";
import { useProjects, type ProjectThread, type Invoice } from "@/lib/projects";
import { QualityScale } from "@/components/QualityScale";
import { STAGES, SUB_STEPS, isPaymentStep } from "@/lib/project-stages";

interface SubStep {
  label: string;
  status: "done" | "current" | "upcoming";
}

function getSubStepStatuses(
  stageKey: string,
  currentStageKey: string,
  stageIndex: number,
  currentStageIndex: number,
  projectInvoices: Invoice[]
): SubStep[] {
  const substeps = SUB_STEPS[stageKey];
  if (!substeps) return [];

  if (stageIndex < currentStageIndex) {
    return substeps.steps.map((label) => ({ label, status: "done" as const }));
  }
  if (stageIndex > currentStageIndex) {
    return substeps.steps.map((label) => ({ label, status: "upcoming" as const }));
  }

  const totalSteps = substeps.steps.length;
  const baseProgress = Math.max(0, Math.floor(totalSteps * 0.4));
  const results: SubStep[] = [];
  let blocked = false;

  for (let i = 0; i < totalSteps; i++) {
    const label = substeps.steps[i];
    if (blocked) {
      results.push({ label, status: "upcoming" });
      continue;
    }
    if (isPaymentStep(label)) {
      const inv = projectInvoices.find((inv) => {
        const desc = inv.description.toLowerCase();
        const l = label.toLowerCase();
        if (l.includes("samples paid")) return desc.includes("sampl");
        if (l.includes("production deposit")) return desc.includes("deposit") || (desc.includes("production") && !desc.includes("balance") && !desc.includes("sampl"));
        if (l.includes("production balance")) return desc.includes("balance") || (desc.includes("production") && !desc.includes("deposit") && !desc.includes("sampl"));
        return false;
      });
      if (inv?.status === "paid") {
        results.push({ label, status: "done" });
      } else {
        results.push({ label, status: i <= baseProgress ? "current" : "upcoming" });
        blocked = true;
      }
    } else {
      if (i < baseProgress) {
        results.push({ label, status: "done" });
      } else if (i === baseProgress) {
        results.push({ label, status: "current" });
        blocked = true;
      } else {
        results.push({ label, status: "upcoming" });
        blocked = true;
      }
    }
  }
  return results;
}

export default function VendorProjects() {
  const { vendorProfile } = useVendorAuth();
  const { threads, invoices } = useProjects();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"active" | "complete" | "all">("active");

  const vendorProjects = threads.filter(
    (t) => t.vendor === vendorProfile.factoryName && t.stage !== "brief"
  );

  const filtered = vendorProjects.filter((p) => {
    if (filter === "active") return p.stage !== "complete";
    if (filter === "complete") return p.stage === "complete";
    return true;
  });

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Production</p>
          <h1 className="font-display text-2xl font-800 uppercase tracking-tight">Projects</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Manage every stage — from sampling through final delivery.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="border-b border-foreground/10 px-6 md:px-8">
        <div className="flex gap-4">
          {(["active", "complete", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`py-3 font-mono text-[10px] uppercase tracking-wider border-b-2 transition-colors ${
                filter === f
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {f} {f === "active" && `(${vendorProjects.filter((p) => p.stage !== "complete").length})`}
            </button>
          ))}
        </div>
      </div>

      <section className="p-6 md:p-8">
        {filtered.length === 0 ? (
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider text-center py-16">
            No {filter} projects
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                invoices={invoices.filter((i) => i.projectId === project.id)}
                expanded={expandedId === project.id}
                onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ProjectCard({ project, invoices: projectInvoices, expanded, onToggle }: {
  project: ProjectThread;
  invoices: Invoice[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const currentStageIndex = STAGES.findIndex((s) => s.key === project.stage);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});

  const isStageExpanded = (key: string) => {
    if (expandedStages[key] !== undefined) return expandedStages[key];
    return key === project.stage;
  };
  const toggleStage = (key: string) => {
    setExpandedStages((prev) => ({ ...prev, [key]: !isStageExpanded(key) }));
  };

  const paidTotal = projectInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingTotal = projectInvoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);

  // Vendor-side action label for the current stage
  const vendorAction = getVendorAction(project.stage);

  return (
    <div className="border border-foreground/10">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div>
          <h3 className="font-body text-sm font-600">{project.product}</h3>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            {project.labelName} · {project.quantity} units · {project.region}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Mini stage progress bar */}
          <div className="hidden md:flex items-center gap-0">
            {STAGES.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className={`w-2.5 h-2.5 ${
                  i < currentStageIndex ? "bg-foreground" : i === currentStageIndex ? "bg-signal" : "bg-foreground/10"
                }`} />
                {i < STAGES.length - 1 && (
                  <div className={`w-3 h-px ${i < currentStageIndex ? "bg-foreground" : "bg-foreground/10"}`} />
                )}
              </div>
            ))}
          </div>
          <span className="font-mono text-[10px] text-muted-foreground uppercase">{project.stage}</span>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-foreground/10">
          {/* Progress tracker (same as brand side) */}
          <div className="p-5 bg-muted/30 border-b border-foreground/10">
            <div className="flex items-center gap-0">
              {STAGES.map((s, i) => {
                const Icon = s.icon;
                const isComplete = i < currentStageIndex;
                const isCurrent = i === currentStageIndex;
                return (
                  <div key={s.key} className="flex items-center flex-1">
                    <div className={`flex flex-col items-center flex-1 ${isCurrent ? "opacity-100" : isComplete ? "opacity-100" : "opacity-30"}`}>
                      <div className={`w-7 h-7 flex items-center justify-center mb-1.5 ${
                        isComplete ? "bg-foreground text-background" : isCurrent ? "bg-signal text-signal-foreground" : "border border-foreground/20"
                      }`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className={`font-mono text-[8px] uppercase tracking-wider text-center ${isCurrent ? "text-foreground font-600" : "text-muted-foreground"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className={`h-px w-full flex-shrink ${i < currentStageIndex ? "bg-foreground" : "bg-foreground/10"}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 p-2.5 bg-background border border-foreground/10">
              <p className="font-body text-xs text-muted-foreground">
                <span className="font-600 text-foreground">{STAGES[currentStageIndex]?.label}:</span>{" "}
                {STAGES[currentStageIndex]?.help}
              </p>
            </div>
          </div>

          {/* Sub-steps per stage */}
          <div className="p-5 space-y-1">
            {STAGES.map((stage, stageIdx) => {
              const stageOpen = isStageExpanded(stage.key);
              const isComplete = stageIdx < currentStageIndex;
              const isCurrent = stageIdx === currentStageIndex;
              const isFuture = stageIdx > currentStageIndex;

              // Hide future stages beyond +1
              if (stageIdx > currentStageIndex + 1) return null;

              const subs = getSubStepStatuses(stage.key, project.stage, stageIdx, currentStageIndex, projectInvoices);

              return (
                <div key={stage.key} className={`border border-foreground/10 ${isFuture ? "opacity-40" : ""}`}>
                  <button
                    onClick={() => toggleStage(stage.key)}
                    className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
                      isCurrent ? "bg-signal/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                        isComplete ? "bg-foreground text-background" : isCurrent ? "bg-signal text-signal-foreground" : "border border-foreground/20"
                      }`}>
                        {isComplete ? <Check className="h-3 w-3" /> : <stage.icon className="h-3 w-3" />}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider">{SUB_STEPS[stage.key]?.label || stage.label}</span>
                        {isCurrent && (
                          <span className="font-mono text-[8px] uppercase tracking-widest ml-2 px-1.5 py-0.5 bg-signal/10 text-signal border border-signal/20">
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                    {stageOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>

                  {stageOpen && (
                    <div className="px-3 pb-3 space-y-0.5">
                      {subs.map((sub, i) => (
                        <VendorSubStepRow key={i} sub={sub} stageKey={stage.key} projectInvoices={projectInvoices} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Financials & quality */}
          <div className="p-5 border-t border-foreground/10 space-y-4">
            <div className="flex items-center gap-6">
              {project.qualityVsCost && (
                <div>
                  <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Brand Priority</p>
                  <QualityScale value={project.qualityVsCost} />
                </div>
              )}
              {projectInvoices.length > 0 && (
                <div className="ml-auto text-right">
                  <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Revenue</p>
                  <div className="flex items-center gap-4">
                    {paidTotal > 0 && <span className="font-display text-sm font-700">${paidTotal.toLocaleString()} paid</span>}
                    {pendingTotal > 0 && <span className="font-display text-sm font-700 text-signal">${pendingTotal.toLocaleString()} pending</span>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-5 border-t border-foreground/10 flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-mono text-[10px]">
              <MessageSquare className="h-3 w-3 mr-1" /> Message Brand
            </Button>
            {vendorAction && (
              <Button variant="editorial" size="sm" className="font-mono text-[10px]">
                {vendorAction.icon} {vendorAction.label}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function VendorSubStepRow({ sub, stageKey, projectInvoices }: {
  sub: SubStep;
  stageKey: string;
  projectInvoices: Invoice[];
}) {
  const [invoiceOpen, setInvoiceOpen] = useState(false);

  // Find matching invoice for payment steps
  const invoice = isPaymentStep(sub.label) ? projectInvoices.find((inv) => {
    const desc = inv.description.toLowerCase();
    const l = sub.label.toLowerCase();
    if (l.includes("samples paid")) return desc.includes("sampl");
    if (l.includes("production deposit")) return desc.includes("deposit") || (desc.includes("production") && !desc.includes("balance") && !desc.includes("sampl"));
    if (l.includes("production balance")) return desc.includes("balance") || (desc.includes("production") && !desc.includes("deposit") && !desc.includes("sampl"));
    return false;
  }) : undefined;

  const showInvoice = !!invoice && sub.status !== "upcoming";

  return (
    <div>
      <div className="flex items-center gap-3 py-1.5">
        <div className={`w-4 h-4 flex items-center justify-center flex-shrink-0 rounded-full ${
          sub.status === "done"
            ? "bg-foreground text-background"
            : sub.status === "current"
              ? "border-2 border-signal bg-signal/10"
              : "border border-foreground/15 bg-background"
        }`}>
          {sub.status === "done" && <Check className="h-2.5 w-2.5" />}
          {sub.status === "current" && <Circle className="h-1.5 w-1.5 fill-signal text-signal" />}
        </div>
        <span className={`font-body text-sm flex-1 ${
          sub.status === "done"
            ? "text-muted-foreground line-through"
            : sub.status === "current"
              ? "text-foreground font-600"
              : "text-muted-foreground/50"
        }`}>
          {sub.label}
        </span>
        {sub.status === "current" && !showInvoice && (
          <span className="font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 bg-signal/10 text-signal border border-signal/20">
            In progress
          </span>
        )}
        {showInvoice && (
          <button
            onClick={() => setInvoiceOpen(!invoiceOpen)}
            className={`font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity ${
              invoice.status === "paid" ? "bg-foreground/5 text-muted-foreground" : "bg-signal/10 text-signal"
            }`}
          >
            <CreditCard className="h-2.5 w-2.5" />
            {invoice.status === "paid" ? "Received" : `$${invoice.amount.toLocaleString()} pending`}
            <ChevronDown className={`h-2.5 w-2.5 transition-transform ${invoiceOpen ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {showInvoice && invoiceOpen && invoice && (
        <div className="ml-7 mt-1 mb-2 p-4 border border-foreground/10 bg-background animate-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[9px] px-2 py-0.5 bg-signal/10 text-signal uppercase tracking-wider">Invoice</span>
            <span className="font-mono text-[9px] text-muted-foreground">{invoice.date}</span>
            <button
              onClick={(e) => { e.stopPropagation(); toast({ title: "Invoice PDF", description: `Downloading invoice for "${invoice.description}"…` }); }}
              className="ml-auto flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              title="View invoice PDF"
            >
              <FileText className="h-3 w-3" /> PDF
            </button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${
                invoice.status === "paid" ? "bg-foreground text-background" : "bg-signal/10 text-signal"
              }`}>
                {invoice.status === "paid" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              </div>
              <div className="min-w-0">
                <span className="font-body text-sm font-600 block">{invoice.description}</span>
                <span className="font-mono text-[9px] text-muted-foreground flex items-center gap-1.5">
                  {invoice.status === "paid" ? (
                    `Received ${invoice.paidDate}`
                  ) : (
                    <>
                      <ShieldCheck className="h-3 w-3 text-signal" /> Held in escrow · Awaiting brand payment
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-display text-base font-800 block">${invoice.amount.toLocaleString()}</span>
              <span className="font-mono text-[9px] text-muted-foreground">
                −${(invoice.amount * 0.025).toFixed(2)} fee = ${(invoice.amount * 0.975).toFixed(2)} net
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getVendorAction(stage: string): { label: string; icon: React.ReactNode } | null {
  switch (stage) {
    case "matched": return { label: "Confirm Terms", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> };
    case "sample": return { label: "Mark Sample Shipped", icon: <Package className="h-3 w-3 mr-1" /> };
    case "production": return { label: "Update Production Status", icon: <Clock className="h-3 w-3 mr-1" /> };
    case "shipped": return { label: "Update Tracking", icon: <Truck className="h-3 w-3 mr-1" /> };
    default: return null;
  }
}
