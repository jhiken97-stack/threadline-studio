import { useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare, Package, Truck, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorAuth } from "@/lib/vendor-auth";
import { useProjects, type ProjectThread, type Invoice } from "@/lib/projects";
import { QualityScale } from "@/components/QualityScale";

const STAGE_CONFIG = [
  { key: "matched", label: "Matched", icon: CheckCircle2, description: "Terms confirmed, ready to begin" },
  { key: "sample", label: "Sampling", icon: Package, description: "Produce and ship samples for brand approval" },
  { key: "production", label: "Production", icon: Package, description: "Bulk production run in progress" },
  { key: "shipped", label: "Shipping", icon: Truck, description: "Ship finished goods to brand" },
  { key: "complete", label: "Complete", icon: CheckCircle2, description: "Delivery confirmed, project closed" },
] as const;

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

function ProjectCard({ project, invoices, expanded, onToggle }: {
  project: ProjectThread;
  invoices: Invoice[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const stageIdx = STAGE_CONFIG.findIndex((s) => s.key === project.stage);

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
          <div className="hidden md:flex items-center gap-1">
            {STAGE_CONFIG.map((s, i) => (
              <div
                key={s.key}
                className={`w-4 h-1.5 ${i <= stageIdx ? "bg-foreground" : "bg-foreground/10"}`}
              />
            ))}
          </div>
          <span className="font-mono text-[10px] text-muted-foreground uppercase">{project.stage}</span>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-foreground/10 p-5 space-y-6">
          {/* Quality scale */}
          {project.qualityVsCost && (
            <div>
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-2">Brand Priority</p>
              <QualityScale value={project.qualityVsCost} />
            </div>
          )}

          {/* Stage pipeline */}
          <div>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-3">Pipeline</p>
            <div className="space-y-2">
              {STAGE_CONFIG.map((stage, i) => {
                const isActive = stage.key === project.stage;
                const isDone = i < stageIdx;
                const isFuture = i > stageIdx;
                return (
                  <div
                    key={stage.key}
                    className={`flex items-center gap-3 p-3 ${
                      isActive ? "bg-foreground text-background" : isDone ? "bg-muted/50" : "opacity-40"
                    }`}
                  >
                    <stage.icon className="h-3.5 w-3.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-[10px] uppercase tracking-wider">{stage.label}</span>
                      {isActive && (
                        <p className={`font-body text-xs mt-0.5 ${isActive ? "text-background/70" : "text-muted-foreground"}`}>
                          {stage.description}
                        </p>
                      )}
                    </div>
                    {isDone && <CheckCircle2 className="h-3 w-3 text-muted-foreground" />}
                    {isActive && (
                      <span className="font-mono text-[9px] uppercase tracking-wider bg-background text-foreground px-2 py-0.5">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-3">Timeline</p>
            <div className="space-y-2">
              {project.timeline.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground w-14 flex-shrink-0">{entry.date}</span>
                  <p className="font-body text-xs text-muted-foreground">{entry.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Invoices */}
          {invoices.length > 0 && (
            <div>
              <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-3">Invoices</p>
              <div className="space-y-1">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-2 border-t border-foreground/5">
                    <div>
                      <p className="font-body text-xs">{inv.description}</p>
                      <p className="font-mono text-[9px] text-muted-foreground">{inv.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-sm font-700">${inv.amount.toLocaleString()}</span>
                      <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 ${
                        inv.status === "paid"
                          ? "bg-muted text-muted-foreground"
                          : "bg-signal/10 text-signal"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-foreground/10">
            <Button variant="outline" size="sm" className="font-mono text-[10px]">
              <MessageSquare className="h-3 w-3 mr-1" /> Message Brand
            </Button>
            {project.stage === "sample" && (
              <Button variant="editorial" size="sm" className="font-mono text-[10px]">
                <Package className="h-3 w-3 mr-1" /> Mark Sample Shipped
              </Button>
            )}
            {project.stage === "production" && (
              <Button variant="editorial" size="sm" className="font-mono text-[10px]">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Production Complete
              </Button>
            )}
            {project.stage === "shipped" && (
              <Button variant="editorial" size="sm" className="font-mono text-[10px]">
                <Truck className="h-3 w-3 mr-1" /> Update Tracking
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
