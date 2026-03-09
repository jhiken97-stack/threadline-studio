import { useState } from "react";
import { ArrowRight, Clock, AlertCircle, CheckCircle2, Package, Truck, FileText, CreditCard } from "lucide-react";

const STAGES = [
  { key: "rfq", label: "RFQ", icon: FileText },
  { key: "sample", label: "Sample", icon: Package },
  { key: "pre-production", label: "Pre-Prod", icon: Clock },
  { key: "bulk", label: "Bulk", icon: Package },
  { key: "qa", label: "QA", icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "invoiced", label: "Invoiced", icon: CreditCard },
];

interface Thread {
  id: number;
  vendor: string;
  product: string;
  stage: string;
  region: string;
  updated: string;
  priority: boolean;
  quantity: string;
}

const THREADS: Thread[] = [
  { id: 1, vendor: "Ateliê Nova", product: "FW26 Hoodie Program", stage: "sample", region: "PT", updated: "2h ago", priority: true, quantity: "300 units" },
  { id: 2, vendor: "Shenzhen Textile Co.", product: "Heavy Tee Blanks", stage: "bulk", region: "CN", updated: "5h ago", priority: false, quantity: "2000 units" },
  { id: 3, vendor: "Brooklyn Garment Dist.", product: "Selvedge Denim Jean", stage: "rfq", region: "US", updated: "1d ago", priority: true, quantity: "150 units" },
  { id: 4, vendor: "Porto Fleece Works", product: "Organic Fleece Crew", stage: "pre-production", region: "PT", updated: "3d ago", priority: false, quantity: "500 units" },
  { id: 5, vendor: "Guangzhou Knit Mill", product: "Merino Cardigan", stage: "qa", region: "CN", updated: "12h ago", priority: true, quantity: "400 units" },
  { id: 6, vendor: "LA Cut House", product: "SS26 Capsule Collection", stage: "shipped", region: "US", updated: "1d ago", priority: false, quantity: "800 units" },
];

export default function Workbench() {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  const filtered = activeStage ? THREADS.filter((t) => t.stage === activeStage) : THREADS;
  const priorityThreads = THREADS.filter((t) => t.priority);

  return (
    <div>
      {/* Header */}
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Production Command</p>
          <h1 className="font-display text-3xl md:text-5xl font-800 uppercase tracking-tight">Label Workbench</h1>
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-b border-foreground/10 overflow-x-auto">
        <div className="container py-6">
          <div className="flex items-center gap-0 min-w-max">
            <button
              onClick={() => setActiveStage(null)}
              className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 transition-all ${
                !activeStage ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({THREADS.length})
            </button>
            {STAGES.map((s, i) => {
              const count = THREADS.filter((t) => t.stage === s.key).length;
              return (
                <div key={s.key} className="flex items-center">
                  <ArrowRight className="h-3 w-3 text-foreground/15 mx-1" />
                  <button
                    onClick={() => setActiveStage(activeStage === s.key ? null : s.key)}
                    className={`font-mono text-[10px] uppercase tracking-widest px-3 py-2 transition-all flex items-center gap-1.5 ${
                      activeStage === s.key ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <s.icon className="h-3 w-3" />
                    {s.label}
                    {count > 0 && (
                      <span className={`text-[9px] ${activeStage === s.key ? "text-background/60" : "text-muted-foreground/50"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container py-8 grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Threads */}
        <div>
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-4">
            Active Threads
            <span className="font-mono text-muted-foreground/50 ml-2">{filtered.length}</span>
          </h2>
          <div className="flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10">
            {filtered.map((thread) => (
              <div key={thread.id} className="py-4 flex flex-col md:flex-row md:items-center gap-3 group hover:bg-muted/30 -mx-4 px-4 transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {thread.priority && <AlertCircle className="h-3.5 w-3.5 text-signal flex-shrink-0" />}
                  <div className="min-w-0">
                    <h3 className="font-body text-sm font-600 truncate">{thread.product}</h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                      {thread.vendor} · {thread.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase tracking-wider">
                    {thread.region}
                  </span>
                  <span className="font-mono text-[10px] px-3 py-1 border border-foreground/15 uppercase tracking-wider text-muted-foreground">
                    {STAGES.find((s) => s.key === thread.stage)?.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/50">{thread.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Priority actions */}
        <aside>
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-4">
            Priority Actions
            <span className="font-mono text-signal ml-2">{priorityThreads.length}</span>
          </h2>
          <div className="space-y-3">
            {priorityThreads.map((t) => (
              <div key={t.id} className="border border-signal/30 p-4 hover:border-signal transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-3 w-3 text-signal" />
                  <span className="font-mono text-[9px] text-signal uppercase tracking-widest">Action needed</span>
                </div>
                <h3 className="font-body text-sm font-600">{t.product}</h3>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  {t.vendor} · {STAGES.find((s) => s.key === t.stage)?.label}
                </p>
              </div>
            ))}
          </div>

          {/* Status overview */}
          <div className="mt-8">
            <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-4">Pipeline Overview</h2>
            <div className="space-y-2">
              {STAGES.map((s) => {
                const count = THREADS.filter((t) => t.stage === s.key).length;
                return (
                  <div key={s.key} className="flex items-center justify-between py-1">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-muted overflow-hidden">
                        <div className="h-full bg-foreground" style={{ width: `${(count / THREADS.length) * 100}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground/50 w-4 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
