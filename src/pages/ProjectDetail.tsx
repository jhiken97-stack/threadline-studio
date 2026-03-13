import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Check, Clock, Package, Truck, FileText, AlertCircle, CreditCard, ShieldCheck, ChevronDown, ChevronRight, Circle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects, Invoice } from "@/lib/projects";
import { BuyerProtectionBadge } from "@/components/BuyerProtectionBadge";
import { STAGES, SUB_STEPS, isPaymentStep } from "@/lib/project-stages";
import { useToast } from "@/hooks/use-toast";
import { FileSharing } from "@/components/project/FileSharing";
import { ShipmentTracker } from "@/components/project/ShipmentTracker";
import { DisputePanel } from "@/components/project/DisputePanel";
import { ContractPanel } from "@/components/project/ContractPanel";
import { AmendmentPanel } from "@/components/project/AmendmentPanel";

interface SubStep {
  label: string;
  status: "done" | "current" | "upcoming";
  note?: string;
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
    // Completed stage — all sub-steps done
    return substeps.steps.map((label) => ({ label, status: "done" as const }));
  }

  if (stageIndex > currentStageIndex) {
    // Future stage — all upcoming
    return substeps.steps.map((label) => ({ label, status: "upcoming" as const }));
  }

  // Current stage — determine progress sequentially
  // A step is "done" only if all prior steps are also "done"
  // Payment steps are "done" only if their linked invoice is paid
  // Non-payment steps use a heuristic based on timeline progress, but respect sequential order
  const totalSteps = substeps.steps.length;
  const baseProgress = Math.max(0, Math.floor(totalSteps * 0.4));

  const results: SubStep[] = [];
  let blocked = false; // once a step is not done, all subsequent are blocked

  for (let i = 0; i < totalSteps; i++) {
    const label = substeps.steps[i];

    if (blocked) {
      results.push({ label, status: "upcoming" });
      continue;
    }

    if (isPaymentStep(label)) {
      // Check if the matching invoice is paid
      const matchingInvoice = findInvoiceForStep(stageKey, label, projectInvoices);
      if (matchingInvoice && matchingInvoice.status === "paid") {
        results.push({ label, status: "done" });
      } else if (matchingInvoice) {
        // Invoice exists but not paid — this is the current step
        results.push({ label, status: "current" });
        blocked = true;
      } else {
        // No invoice yet — use base progress heuristic
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
    } else {
      // Non-payment step — use base progress heuristic
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

function findInvoiceForStep(stageKey: string, subLabel: string, projectInvoices: Invoice[]): Invoice | undefined {
  const label = subLabel.toLowerCase();
  return projectInvoices.find(inv => {
    const desc = inv.description.toLowerCase();
    if (label.includes("samples paid")) return desc.includes("sampl");
    if (label.includes("production deposit")) {
      return desc.includes("deposit") || (desc.includes("production") && !desc.includes("balance") && !desc.includes("sampl"));
    }
    if (label.includes("production balance")) {
      // Match balance invoices, OR "full" production invoices (single payment covers both)
      return desc.includes("balance") || (desc.includes("production") && !desc.includes("deposit") && !desc.includes("sampl"));
    }
    return false;
  });
}

function SubStepRow({ sub, invoice, payingId, paidId, onPay }: {
  sub: SubStep;
  invoice?: Invoice;
  payingId: number | null;
  paidId: number | null;
  onPay: (inv: Invoice) => void;
}) {
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const { toast } = useToast();
  // Show invoice for done and current steps (not upcoming/future)
  const showInvoice = !!invoice && sub.status !== "upcoming";
  const isPaying = invoice ? payingId === invoice.id : false;
  const justPaid = invoice ? paidId === invoice.id : false;

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
            {invoice.status === "paid" ? "Paid" : `$${invoice.amount.toLocaleString()} due`}
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
                  {invoice.status === "paid" ? `Paid ${invoice.paidDate}` : (
                    <>
                      <ShieldCheck className="h-3 w-3 text-signal" /> Held in escrow
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <span className="font-display text-base font-800 block">${invoice.amount.toLocaleString()}</span>
                <span className="font-mono text-[9px] text-muted-foreground">
                  +${(invoice.amount * 0.025).toFixed(2)} fee = ${(invoice.amount * 1.025).toFixed(2)}
                </span>
              </div>
              {invoice.status === "pending" ? (
                sub.status === "upcoming" ? (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50 min-w-[110px] text-center">
                    Locked — complete prior steps
                  </span>
                ) : (
                  <Button
                    variant="signal"
                    size="sm"
                    disabled={isPaying}
                    onClick={(e) => { e.stopPropagation(); onPay(invoice); }}
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
                )
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 min-w-[80px] text-center">
                  {justPaid ? "✓ Sent" : "Paid"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const { getProject, conversations, messages, invoices, payInvoice, addMessage } = useProjects();
  const project = getProject(id || "");
  const [payingId, setPayingId] = useState<number | null>(null);
  const [paidId, setPaidId] = useState<number | null>(null);
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-expand current stage
  const isExpanded = (key: string) => {
    if (expandedStages[key] !== undefined) return expandedStages[key];
    return key === project.stage; // default expand current stage
  };

  const toggleStage = (key: string) => {
    setExpandedStages(prev => ({ ...prev, [key]: !isExpanded(key) }));
  };

  const handlePay = (inv: Invoice) => {
    setPayingId(inv.id);
    setTimeout(() => {
      payInvoice(inv.id);
      setPayingId(null);
      setPaidId(inv.id);
      setTimeout(() => setPaidId(null), 3000);
    }, 2000);
  };

  // Match invoices to specific sub-step labels (reuses the top-level helper)
  const getSubStepInvoice = (stageKey: string, subLabel: string): Invoice | undefined => {
    return findInvoiceForStep(stageKey, subLabel, projectInvoices);
  };

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
            <Button variant="editorial" size="sm" onClick={() => setChatOpen(true)}>
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Message Vendor
            </Button>
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

      {/* Detailed Timeline with Collapsible Sub-steps */}
      <section className="container py-8 max-w-3xl">
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
          {STAGES.map((stage, stageIdx) => {
            const isComplete = stageIdx < currentStageIndex;
            const isCurrent = stageIdx === currentStageIndex;
            const isFuture = stageIdx > currentStageIndex;
            const expanded = isExpanded(stage.key);
            const subSteps = getSubStepStatuses(stage.key, project.stage, stageIdx, currentStageIndex, projectInvoices);
            
            const timelineEntries = project.timeline.filter(t => t.stage === stage.key);

            return (
              <div key={stage.key} className="relative">
                {/* Vertical connector */}
                {stageIdx < STAGES.length - 1 && (
                  <div className={`absolute left-[11px] top-[28px] bottom-0 w-px ${
                    isComplete ? "bg-foreground" : isCurrent ? "bg-foreground/30" : "bg-foreground/10"
                  }`} />
                )}

                {/* Stage header — collapsible */}
                <button
                  onClick={() => toggleStage(stage.key)}
                  className={`w-full flex items-center gap-3 py-3 text-left group transition-colors ${
                    isFuture ? "opacity-40" : ""
                  }`}
                >
                  {/* Stage dot */}
                  <div className={`relative z-10 w-6 h-6 flex items-center justify-center flex-shrink-0 ${
                    isComplete
                      ? "bg-foreground text-background"
                      : isCurrent
                        ? "bg-signal text-signal-foreground"
                        : "border border-foreground/20 bg-background"
                  }`}>
                    {isComplete ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="font-mono text-[9px] font-700">{stageIdx + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className={`font-display text-sm uppercase tracking-tight ${
                      isCurrent ? "font-800 text-foreground" : isComplete ? "font-700 text-foreground" : "font-600 text-muted-foreground"
                    }`}>
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="font-mono text-[9px] uppercase tracking-wider text-signal ml-2">Current</span>
                    )}
                  </div>

                  {!isFuture && (
                    expanded
                      ? <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      : <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {/* Expanded sub-steps */}
                {expanded && !isFuture && (
                  <div className="ml-[11px] pl-6 border-l border-foreground/10 pb-4 space-y-1">
                    {/* Sub-step checklist with inline invoices */}
                    <div className="space-y-0">
                      {subSteps.map((sub, si) => {
                        const invoice = getSubStepInvoice(stage.key, sub.label);
                        return (
                          <div key={si}>
                            <SubStepRow
                              sub={sub}
                              invoice={invoice}
                              payingId={payingId}
                              paidId={paidId}
                              onPay={handlePay}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Timeline notes for this stage */}
                    {timelineEntries.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {timelineEntries.map((entry, ei) => (
                          <div key={ei} className="p-3 bg-muted/30 border border-foreground/5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{entry.date}</span>
                            </div>
                            <p className="font-body text-xs text-foreground/70">{entry.note}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature panels */}
        <div className="space-y-4 mt-6">
          <ContractPanel projectId={project.id} role="brand" />
          <FileSharing projectId={project.id} role="brand" />
          <ShipmentTracker projectId={project.id} />
          <AmendmentPanel projectId={project.id} role="brand" />
          <DisputePanel projectId={project.id} role="brand" />
        </div>

        {/* Buyer Protection + Fee note */}
        {projectInvoices.length > 0 && (
          <div className="space-y-2 mt-6 mb-6">
            <BuyerProtectionBadge variant="block" />
            <div className="p-4 border border-foreground/10 bg-muted/30">
              <p className="font-mono text-[9px] text-muted-foreground leading-relaxed">
                <span className="text-signal font-600">Platform fee:</span> 2.5% is added to your invoice total at checkout. 2.5% is deducted from the vendor's payout. No hidden charges.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-foreground/10">
          <Button variant="editorial" onClick={() => setChatOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-1.5" /> Message {project.vendor}
          </Button>
          <Link to="/workbench">
            <Button variant="ghost">Back to All Projects</Button>
          </Link>
        </div>
      </section>

      {/* Chat popup */}
      {chatOpen && <ChatPopup
        vendorName={project.vendor}
        projectId={project.id}
        conversations={conversations}
        messages={messages}
        addMessage={addMessage}
        onClose={() => setChatOpen(false)}
      />}
    </div>
  );
}

function ChatPopup({
  vendorName,
  projectId,
  conversations,
  messages,
  addMessage,
  onClose,
}: {
  vendorName: string;
  projectId: number;
  conversations: any[];
  messages: Record<number, any[]>;
  addMessage: (convoId: number, msg: any) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const convo = conversations.find(c => c.projectId === projectId);
  const convoId = convo?.id;
  const chatMessages = convoId ? (messages[convoId] || []) : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  const handleSend = () => {
    if (!input.trim() || !convoId) return;
    addMessage(convoId, {
      id: Date.now(),
      sender: "brand" as const,
      text: input.trim(),
      time: "Just now",
    });
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[480px] flex flex-col border border-foreground/15 bg-background shadow-2xl">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10 bg-muted/30">
        <div>
          <span className="font-display text-sm font-700 uppercase tracking-tight">{vendorName}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block">Direct message</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-foreground/5 transition-colors">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatMessages.length === 0 && (
          <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider text-center py-8">
            No messages yet — start the conversation
          </p>
        )}
        {chatMessages.map((msg: any) => (
          <div key={msg.id} className={`flex ${msg.sender === "brand" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3 py-2 ${
              msg.sender === "brand"
                ? "bg-foreground text-background"
                : "bg-muted/50 border border-foreground/10"
            }`}>
              <p className="font-body text-xs leading-relaxed">{msg.text}</p>
              <span className={`font-mono text-[8px] block mt-1 ${
                msg.sender === "brand" ? "text-background/50" : "text-muted-foreground/50"
              }`}>{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-foreground/10 px-3 py-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message…"
          className="flex-1 bg-transparent font-body text-sm outline-none placeholder:text-muted-foreground/40"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2 bg-foreground text-background disabled:opacity-30 transition-opacity hover:opacity-80"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
