import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Check, Clock, Package, Truck, FileText, AlertCircle, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects, Invoice } from "@/lib/projects";
import { BuyerProtectionBadge } from "@/components/BuyerProtectionBadge";

const STAGES = [
  { key: "brief", label: "Brief Sent", icon: FileText, help: "Your project details have been shared with the manufacturer. They'll review and respond soon." },
  { key: "matched", label: "Vendor Matched", icon: Check, help: "A manufacturer has accepted your project. You can now discuss details and request samples." },
  { key: "sample", label: "Sampling", icon: Package, help: "Your manufacturer is creating sample pieces. Once you receive them, you'll approve or request changes before bulk production." },
  { key: "production", label: "In Production", icon: Clock, help: "Your approved design is being manufactured in bulk. This is the longest stage — your manufacturer will keep you updated." },
  { key: "shipped", label: "Shipping & QA", icon: Truck, help: "Your finished products are being quality-checked and shipped to you. Almost there!" },
  { key: "complete", label: "Delivered", icon: Check, help: "Your order has arrived! Review your experience and reorder when you're ready for your next drop." },
];

export default function ProjectDetail() {
  const { id } = useParams();
  const { getProject, conversations, invoices, payInvoice } = useProjects();
  const project = getProject(id || "");
  const [payingId, setPayingId] = useState<number | null>(null);
  const [paidId, setPaidId] = useState<number | null>(null);

  if (!project) {
    return (
      <div className="container py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Project not found</p>
        <Link to="/workbench"><Button variant="editorial">Back to Workbench</Button></Link>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex(s => s.key === project.stage);
  const projectInvoices = invoices.filter(inv => inv.projectId === project.id);
  const pendingInvoices = projectInvoices.filter(inv => inv.status === "pending");
  const paidTotal = projectInvoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pendingTotal = pendingInvoices.reduce((s, i) => s + i.amount, 0);

  const handlePay = (inv: Invoice) => {
    setPayingId(inv.id);
    setTimeout(() => {
      payInvoice(inv.id);
      setPayingId(null);
      setPaidId(inv.id);
      setTimeout(() => setPaidId(null), 3000);
    }, 2000);
  };

  // Merge timeline entries and invoices into a single chronological feed
  const timelineItems: { type: "event" | "invoice"; date: string; data: any }[] = [
    ...project.timeline.map((entry) => ({ type: "event" as const, date: entry.date, data: entry })),
    ...projectInvoices.map((inv) => ({ type: "invoice" as const, date: inv.date, data: inv })),
  ];

  return (
    <div>
      {/* Header */}
      <section className="border-b border-foreground/10">
        <div className="container py-8">
          <Link to="/workbench" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mb-4">
            <ArrowLeft className="h-3 w-3" /> Back to Workbench
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight">{project.product}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-body text-sm text-muted-foreground">{project.vendor}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{project.region}</span>
                {project.priority && (
                  <span className="font-mono text-[10px] text-signal flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Needs attention
                  </span>
                )}
              </div>
            </div>
            <Link to="/messages">
              <Button variant="editorial" size="sm">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Message Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Progress tracker */}
      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Production Progress</p>
          <div className="flex items-center gap-0">
            {STAGES.map((s, i) => {
              const Icon = s.icon;
              const isComplete = i < currentStageIndex;
              const isCurrent = i === currentStageIndex;
              return (
                <div key={s.key} className="flex items-center flex-1">
                  <div className={`flex flex-col items-center flex-1 ${isCurrent ? "opacity-100" : isComplete ? "opacity-100" : "opacity-30"}`}>
                    <div className={`w-8 h-8 flex items-center justify-center mb-2 ${
                      isComplete ? "bg-foreground text-background" : isCurrent ? "bg-signal text-signal-foreground" : "border border-foreground/20"
                    }`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className={`font-mono text-[9px] uppercase tracking-wider text-center ${isCurrent ? "text-foreground font-600" : "text-muted-foreground"}`}>
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
          <div className="mt-4 p-3 bg-background border border-foreground/10">
            <p className="font-body text-xs text-muted-foreground">
              <span className="font-600 text-foreground">{STAGES[currentStageIndex]?.label}:</span>{" "}
              {STAGES[currentStageIndex]?.help}
            </p>
          </div>
        </div>
      </section>

      {/* Unified Timeline + Invoices */}
      <section className="container py-8 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Project Timeline & Payments</h2>
          {projectInvoices.length > 0 && (
            <div className="flex items-center gap-3">
              {paidTotal > 0 && (
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  Paid: ${paidTotal.toLocaleString()}
                </span>
              )}
              {pendingTotal > 0 && (
                <span className="font-mono text-[9px] uppercase tracking-wider text-signal">
                  Pending: ${pendingTotal.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="space-y-0">
          {timelineItems.map((item, i) => {
            if (item.type === "event") {
              const entry = item.data;
              return (
                <div key={`event-${i}`} className="flex gap-4 pb-6 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 bg-foreground flex-shrink-0 mt-1" />
                    {i < timelineItems.length - 1 && <div className="w-px flex-1 bg-foreground/15 mt-1" />}
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{entry.date}</span>
                      <span className="font-mono text-[9px] px-2 py-0.5 border border-foreground/10 uppercase tracking-wider text-muted-foreground">
                        {STAGES.find(s => s.key === entry.stage)?.label}
                      </span>
                    </div>
                    <p className="font-body text-sm text-foreground/80">{entry.note}</p>
                  </div>
                </div>
              );
            }

            // Invoice item
            const inv = item.data as Invoice;
            const fee = inv.amount * 0.025;
            const totalWithFee = inv.amount + fee;
            const isPaying = payingId === inv.id;
            const justPaid = paidId === inv.id;

            return (
              <div key={`inv-${inv.id}`} className="flex gap-4 pb-6 relative">
                <div className="flex flex-col items-center">
                  <div className={`w-2 h-2 flex-shrink-0 mt-1 ${inv.status === "paid" ? "bg-foreground" : "bg-signal"}`} />
                  {i < timelineItems.length - 1 && <div className="w-px flex-1 bg-foreground/15 mt-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{inv.date}</span>
                    <span className="font-mono text-[9px] px-2 py-0.5 bg-signal/10 text-signal uppercase tracking-wider">
                      Invoice
                    </span>
                  </div>
                  <div className="p-4 border border-foreground/10 bg-muted/20 mt-1">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${
                          inv.status === "paid" ? "bg-foreground text-background" : "bg-signal/10 text-signal"
                        }`}>
                          {inv.status === "paid" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-body text-sm font-600 block">{inv.description}</span>
                          <span className="font-mono text-[9px] text-muted-foreground flex items-center gap-1.5">
                            {inv.status === "paid" ? `Paid ${inv.paidDate}` : (
                              <>
                                <ShieldCheck className="h-3 w-3 text-signal" /> Held in escrow
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <span className="font-display text-base font-800 block">${inv.amount.toLocaleString()}</span>
                          <span className="font-mono text-[9px] text-muted-foreground">
                            +${fee.toFixed(2)} fee = ${totalWithFee.toFixed(2)}
                          </span>
                        </div>
                        {inv.status === "pending" ? (
                          <Button
                            variant="signal"
                            size="sm"
                            disabled={isPaying}
                            onClick={() => handlePay(inv)}
                            className="min-w-[110px]"
                          >
                            {isPaying ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                Processing…
                              </span>
                            ) : (
                              <>
                                <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Pay
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 min-w-[80px] text-center">
                            {justPaid ? "✓ Sent" : "Paid"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buyer Protection + Fee note */}
        {projectInvoices.length > 0 && (
          <div className="space-y-2 mt-2 mb-6">
            <BuyerProtectionBadge variant="block" />
            <div className="p-4 border border-foreground/10 bg-muted/30">
              <p className="font-mono text-[9px] text-muted-foreground leading-relaxed">
                <span className="text-signal font-600">Platform fee:</span> 1% is added to your invoice total at checkout. 1% is deducted from the vendor's payout. No hidden charges.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-foreground/10">
          <Link to="/messages">
            <Button variant="editorial">
              <MessageSquare className="h-4 w-4 mr-1.5" /> Message {project.vendor}
            </Button>
          </Link>
          <Link to="/workbench">
            <Button variant="ghost">Back to All Projects</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
