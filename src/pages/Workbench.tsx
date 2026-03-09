import { useState } from "react";
import { ArrowRight, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/projects";

const STAGES = [
  { key: "brief", label: "Brief Sent", description: "Your project details are being reviewed by manufacturers." },
  { key: "matched", label: "Matched", description: "A manufacturer has been paired with your project. Time to discuss details." },
  { key: "sample", label: "Sampling", description: "Sample pieces are being made. You'll review them before approving bulk production." },
  { key: "production", label: "Production", description: "Your approved design is being manufactured at scale." },
  { key: "shipped", label: "Shipping", description: "Products are on their way to you after final quality checks." },
  { key: "complete", label: "Delivered", description: "Your order has arrived! You're ready to launch." },
];

export default function Workbench() {
  const { threads } = useProjects();
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const filtered = activeStage ? threads.filter((t) => t.stage === activeStage) : threads;

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Your Projects</p>
          <h1 className="font-display text-3xl md:text-4xl font-800 uppercase tracking-tight">Workbench</h1>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-lg">
            Track every project from first idea to finished product. Click any project to see full details and next steps.
          </p>
        </div>
      </section>

      {/* Pipeline overview */}
      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Where your projects stand</h2>
            <Link to="/how-it-works" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              How does this work? <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {STAGES.map((s, i) => {
              const count = threads.filter((t) => t.stage === s.key).length;
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
                    Step {i + 1}
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

      {/* Project list */}
      <div className="container py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-sm text-muted-foreground mb-2">No projects at this stage yet</p>
            <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-6">Start by browsing manufacturers or submitting a project brief</p>
            <div className="flex gap-3 justify-center">
              <Link to="/vendors">
                <Button variant="editorial" size="lg">Browse Manufacturers</Button>
              </Link>
              <Link to="/brief">
                <Button variant="ghost" size="lg">Start a Brief <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-foreground/10 border-t border-foreground/10">
            {filtered.map((thread) => {
              const stageIndex = STAGES.findIndex(s => s.key === thread.stage);
              return (
                <Link
                  key={thread.id}
                  to={`/workbench/${thread.id}`}
                  className="py-5 flex flex-col md:flex-row md:items-center gap-4 group hover:bg-muted/30 -mx-4 px-4 transition-colors cursor-pointer"
                >
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
                    <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{thread.region}</span>
                    <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground">
                      {STAGES[stageIndex]?.label}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/40">{thread.updated}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
