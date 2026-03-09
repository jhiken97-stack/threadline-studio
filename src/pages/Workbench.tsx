import { useState } from "react";
import { ArrowRight, AlertCircle, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STAGES = [
  { key: "brief", label: "Brief Sent", description: "Your production brief has been submitted and is being matched." },
  { key: "matched", label: "Vendors Matched", description: "Matched vendors are reviewing your brief. You'll get quotes soon." },
  { key: "sample", label: "Sampling", description: "Samples are being produced. Review and approve before bulk." },
  { key: "production", label: "Production", description: "Bulk production is underway with your approved manufacturer." },
  { key: "shipped", label: "Shipped & QA", description: "Product is being shipped and quality-checked before delivery." },
  { key: "complete", label: "Complete", description: "Order delivered. Review your manufacturer for future projects." },
];

interface Thread {
  id: number;
  vendor: string;
  product: string;
  stage: string;
  region: string;
  updated: string;
  priority: boolean;
}

const THREADS: Thread[] = [
  { id: 1, vendor: "Ateliê Nova", product: "FW26 Hoodie Program", stage: "sample", region: "PT", updated: "2h ago", priority: true },
  { id: 2, vendor: "Shenzhen Textile Co.", product: "Heavy Tee Blanks", stage: "production", region: "CN", updated: "5h ago", priority: false },
  { id: 3, vendor: "Brooklyn Garment Dist.", product: "Selvedge Denim Jean", stage: "matched", region: "US", updated: "1d ago", priority: true },
  { id: 4, vendor: "Porto Fleece Works", product: "Organic Fleece Crew", stage: "brief", region: "PT", updated: "3d ago", priority: false },
];

export default function Workbench() {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const filtered = activeStage ? THREADS.filter((t) => t.stage === activeStage) : THREADS;

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Your Dashboard</p>
          <h1 className="font-display text-3xl md:text-4xl font-800 uppercase tracking-tight">Workbench</h1>
        </div>
      </section>

      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Your Production Pipeline</h2>
            <Link to="/how-it-works" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Learn more <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {STAGES.map((s, i) => {
              const count = THREADS.filter((t) => t.stage === s.key).length;
              const isActive = activeStage === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveStage(isActive ? null : s.key)}
                  className={`text-left p-3 border transition-all ${
                    isActive ? "bg-foreground text-background border-foreground" : "border-foreground/10 hover:border-foreground/30 bg-background"
                  }`}
                >
                  <span className={`font-mono text-[9px] uppercase tracking-widest block mb-1 ${isActive ? "text-background/60" : "text-muted-foreground/50"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-xs font-600 block">{s.label}</span>
                  {count > 0 && (
                    <span className="font-mono text-[9px] mt-1 block text-signal">{count} active</span>
                  )}
                </button>
              );
            })}
          </div>
          {activeStage && (
            <p className="font-body text-xs text-muted-foreground mt-3">
              {STAGES.find(s => s.key === activeStage)?.description}
            </p>
          )}
        </div>
      </section>

      <div className="container py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">No active projects at this stage</p>
            <Link to="/brief">
              <Button variant="editorial" size="lg">Start a Production Brief <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-foreground/10 border-t border-foreground/10">
            {filtered.map((thread) => {
              const stageIndex = STAGES.findIndex(s => s.key === thread.stage);
              return (
                <div key={thread.id} className="py-5 flex flex-col md:flex-row md:items-center gap-4 group hover:bg-muted/30 -mx-4 px-4 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {thread.priority && <AlertCircle className="h-3.5 w-3.5 text-signal flex-shrink-0" />}
                    <div className="min-w-0">
                      <h3 className="font-body text-sm font-600">{thread.product}</h3>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{thread.vendor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {STAGES.map((s, i) => (
                      <div key={s.key} className={`h-1 w-4 ${i <= stageIndex ? "bg-foreground" : "bg-foreground/10"}`} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Link to="/messages" className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Message
                    </Link>
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{thread.region}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground">
                      {STAGES[stageIndex]?.label}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/40">{thread.updated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
