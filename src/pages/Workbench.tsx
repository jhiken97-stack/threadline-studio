import { useState } from "react";
import { ArrowRight, AlertCircle, ChevronRight, Package, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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
      {/* Header */}
      <section className="border-b border-foreground/10">
        <div className="container py-12 md:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Dashboard</p>
          <h1 className="font-display text-4xl md:text-5xl font-800 uppercase tracking-tight">Workbench</h1>
          <p className="font-body text-base text-muted-foreground mt-3 max-w-2xl">
            Track every project from first idea to finished product. Click any project to see full details and next steps.
          </p>
        </div>
      </section>

      {/* Summary bar */}
      <section className="border-b border-foreground/10">
        <div className="container py-4 flex items-center gap-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {threads.length} {threads.length === 1 ? "project" : "projects"}
          </span>
          <span className="h-3 w-px bg-foreground/10" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-signal">
            {threads.filter(t => t.priority).length} need attention
          </span>
        </div>
      </section>

      {/* Project tiles */}
      <div className="container py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-8 w-8 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-body text-base text-muted-foreground mb-1">No projects yet</p>
            <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider mb-8">
              Start by browsing manufacturers or submitting a project brief
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((thread) => {
              const stageIndex = STAGES.findIndex(s => s.key === thread.stage);
              const stageLabel = STAGES[stageIndex]?.label;
              return (
                <Link
                  key={thread.id}
                  to={`/workbench/${thread.id}`}
                  className="group border border-foreground/10 hover:border-foreground/40 bg-background hover:bg-muted/20 transition-all p-6 flex flex-col gap-5 relative"
                >
                  {/* Priority badge */}
                  {thread.priority && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-signal/10 border border-signal/20 cursor-default">
                          <AlertCircle className="h-3 w-3 text-signal" />
                          <span className="font-mono text-[9px] uppercase tracking-wider text-signal font-600">Action needed</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <span className="font-mono text-[10px] uppercase tracking-wider">Action required — review pending items</span>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* Title block */}
                  <div>
                    <h3 className="font-display text-lg md:text-xl font-700 uppercase tracking-tight leading-tight pr-32">
                      {thread.product}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mt-1">{thread.vendor}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-0.5 w-full">
                    {STAGES.map((s, i) => (
                      <div
                        key={s.key}
                        className={`h-1 flex-1 transition-colors ${
                          i <= stageIndex ? "bg-foreground" : "bg-foreground/8"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground/50" />
                        <span className="font-mono text-[10px] uppercase font-600">{thread.region}</span>
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground">
                        {stageLabel}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground/40">
                        <Clock className="h-3 w-3" />
                        <span className="font-mono text-[10px]">{thread.updated}</span>
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Pipeline overview — reference section at bottom */}
      <section className="border-t border-foreground/10 bg-muted/20">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Pipeline stages</h2>
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
            <p className="font-body text-xs text-muted-foreground mt-3 max-w-2xl">
              {STAGES.find(s => s.key === activeStage)?.description}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
