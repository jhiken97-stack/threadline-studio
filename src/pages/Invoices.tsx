import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Check, Clock, CreditCard, AlertCircle, Receipt, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects, Invoice } from "@/lib/projects";

export default function Invoices() {
  const { invoices, threads, payInvoice } = useProjects();
  const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");
  const [payingId, setPayingId] = useState<number | null>(null);
  const [paidId, setPaidId] = useState<number | null>(null);
  const [collapsedProjects, setCollapsedProjects] = useState<Set<number>>(new Set());

  const filtered = invoices.filter((inv) => {
    if (filter === "pending") return inv.status === "pending";
    if (filter === "paid") return inv.status === "paid";
    return true;
  });

  // Group invoices by project
  const groupedByProject = useMemo(() => {
    const groups: { projectId: number; project: typeof threads[0] | undefined; invoices: Invoice[] }[] = [];
    const projectMap = new Map<number, Invoice[]>();

    for (const inv of filtered) {
      if (!projectMap.has(inv.projectId)) projectMap.set(inv.projectId, []);
      projectMap.get(inv.projectId)!.push(inv);
    }

    for (const [projectId, invs] of projectMap) {
      groups.push({ projectId, project: threads.find((t) => t.id === projectId), invoices: invs });
    }

    return groups;
  }, [filtered, threads]);

  const handlePay = (inv: Invoice) => {
    setPayingId(inv.id);
    setTimeout(() => {
      payInvoice(inv.id);
      setPayingId(null);
      setPaidId(inv.id);
      setTimeout(() => setPaidId(null), 3000);
    }, 2000);
  };

  const toggleCollapse = (projectId: number) => {
    setCollapsedProjects((prev) => {
      const next = new Set(prev);
      next.has(projectId) ? next.delete(projectId) : next.add(projectId);
      return next;
    });
  };

  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Financial</p>
          <h1 className="font-display text-3xl md:text-4xl font-800 uppercase tracking-tight">Invoices & Payments</h1>
          <p className="font-body text-sm text-muted-foreground mt-2 max-w-lg">
            View invoices from your manufacturers and pay securely through the platform.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-background border border-foreground/10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Total Invoices</span>
              <span className="font-display text-2xl font-800">{invoices.length}</span>
            </div>
            <div className="p-4 bg-background border border-foreground/10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Pending</span>
              <span className="font-display text-2xl font-800 text-signal">${totalPending.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-background border border-foreground/10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Paid</span>
              <span className="font-display text-2xl font-800">${totalPaid.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-background border border-foreground/10">
              <span className="font-mono text-[9px] uppercase tracking-widest text-signal block mb-1">Platform Fee</span>
              <span className="font-mono text-[10px] text-muted-foreground">1% added to your total · 1% deducted from vendor payout</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container pt-6 pb-2">
        <div className="flex gap-2">
          {(["all", "pending", "paid"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 transition-colors ${
                filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f} {f !== "all" && `(${invoices.filter((i) => f === "pending" ? i.status === "pending" : i.status === "paid").length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices grouped by project */}
      <div className="container py-4 pb-12">
        {groupedByProject.length === 0 ? (
          <div className="text-center py-16">
            <Receipt className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-body text-sm text-muted-foreground mb-1">No invoices yet</p>
            <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
              Invoices from your manufacturers will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedByProject.map(({ projectId, project, invoices: projectInvoices }) => {
              const isCollapsed = collapsedProjects.has(projectId);
              const projectPending = projectInvoices.filter((i) => i.status === "pending");
              const projectTotal = projectInvoices.reduce((s, i) => s + i.amount, 0);
              const projectPendingTotal = projectPending.reduce((s, i) => s + i.amount, 0);

              return (
                <div key={projectId} className="border border-foreground/10">
                  {/* Project header */}
                  <button
                    onClick={() => toggleCollapse(projectId)}
                    className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {isCollapsed ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      <div>
                        <h3 className="font-body text-sm font-600">{project?.product || "Project"}</h3>
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                          {project?.vendor} · {project?.region} · {projectInvoices.length} invoice{projectInvoices.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {projectPendingTotal > 0 && (
                        <span className="font-mono text-[10px] text-signal uppercase tracking-wider">
                          ${projectPendingTotal.toLocaleString()} pending
                        </span>
                      )}
                      <span className="font-display text-lg font-800">${projectTotal.toLocaleString()}</span>
                      {project && (
                        <Link
                          to={`/workbench/${project.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                        >
                          View project →
                        </Link>
                      )}
                    </div>
                  </button>

                  {/* Invoices */}
                  {!isCollapsed && (
                    <div className="divide-y divide-foreground/10">
                      {projectInvoices.map((inv) => {
                        const platformFee = inv.amount * 0.01;
                        const totalWithFee = inv.amount + platformFee;
                        const isPaying = payingId === inv.id;
                        const justPaid = paidId === inv.id;

                        return (
                          <div key={inv.id} className="py-4 px-4 flex flex-col md:flex-row md:items-center gap-4 bg-background">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${
                                inv.status === "paid" ? "bg-foreground text-background" : "bg-signal/10 text-signal"
                              }`}>
                                {inv.status === "paid" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-body text-sm font-600">{inv.description}</h4>
                                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">{inv.date}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-5 flex-shrink-0">
                              <div className="text-right">
                                <span className="font-display text-base font-800 block">${inv.amount.toLocaleString()}</span>
                                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                                  + ${platformFee.toFixed(2)} fee = ${totalWithFee.toFixed(2)}
                                </span>
                              </div>

                              {inv.status === "pending" ? (
                                <Button
                                  variant="signal"
                                  size="sm"
                                  disabled={isPaying}
                                  onClick={() => handlePay(inv)}
                                  className="min-w-[120px]"
                                >
                                  {isPaying ? (
                                    <span className="flex items-center gap-1.5">
                                      <span className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                      Processing…
                                    </span>
                                  ) : (
                                    <>
                                      <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Pay Now
                                    </>
                                  )}
                                </Button>
                              ) : (
                                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 min-w-[120px] text-center">
                                  {justPaid ? "✓ Payment sent" : "Paid"}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Fee explanation */}
        <div className="mt-8 p-5 border border-foreground/10 bg-muted/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-signal flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-body text-sm font-600 mb-1">How Threadline fees work</h3>
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                A 1% platform fee is added to each invoice total when you pay. Separately, 1% is deducted from the vendor's payout.
                This 2% combined fee keeps the platform running — no hidden charges, no subscriptions, no markups on manufacturing costs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
