import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Check, Clock, Package, Truck, FileText, AlertCircle, CreditCard, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/lib/projects";

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
  const { getProject, conversations, invoices } = useProjects();
  const project = getProject(id || "");

  if (!project) {
    return (
      <div className="container py-20 text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Project not found</p>
        <Link to="/workbench"><Button variant="editorial">Back to Workbench</Button></Link>
      </div>
    );
  }

  const currentStageIndex = STAGES.findIndex(s => s.key === project.stage);
  const relatedConvo = conversations.find(c => c.projectId === project.id);
  const projectInvoices = invoices.filter(inv => inv.projectId === project.id);
  const pendingInvoices = projectInvoices.filter(inv => inv.status === "pending");

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
            <div className="flex gap-2">
              <Link to="/invoices">
                <Button variant="editorial" size="sm">
                  <Receipt className="h-3.5 w-3.5 mr-1.5" /> Invoices
                  {pendingInvoices.length > 0 && (
                    <span className="ml-1.5 bg-signal text-signal-foreground text-[9px] px-1.5 py-0.5 font-mono">
                      {pendingInvoices.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="editorial" size="sm">
                  <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> Message Vendor
                </Button>
              </Link>
            </div>
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

      {/* Invoices for this project */}
      {projectInvoices.length > 0 && (
        <section className="border-b border-foreground/10">
          <div className="container py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Project Invoices</h2>
              <Link to="/invoices" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                View all →
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-foreground/10 border-t border-b border-foreground/10">
              {projectInvoices.map((inv) => {
                const fee = inv.amount * 0.01;
                return (
                  <div key={inv.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 flex items-center justify-center ${
                        inv.status === "paid" ? "bg-foreground text-background" : "bg-signal/10 text-signal"
                      }`}>
                        {inv.status === "paid" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      </div>
                      <div>
                        <span className="font-body text-xs font-600">{inv.description}</span>
                        <span className="font-mono text-[9px] text-muted-foreground block">
                          {inv.date} · {inv.status === "paid" ? `Paid ${inv.paidDate}` : "Pending"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-sm font-800">${inv.amount.toLocaleString()}</span>
                      <span className="font-mono text-[9px] text-muted-foreground block">+${fee.toFixed(2)} fee</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="container py-8 max-w-2xl">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-6">Project Timeline</h2>
        <div className="space-y-0">
          {project.timeline.map((entry, i) => (
            <div key={i} className="flex gap-4 pb-6 relative">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 bg-foreground flex-shrink-0 mt-1" />
                {i < project.timeline.length - 1 && <div className="w-px flex-1 bg-foreground/15 mt-1" />}
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
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-foreground/10">
          <Link to="/messages">
            <Button variant="editorial">
              <MessageSquare className="h-4 w-4 mr-1.5" /> Message {project.vendor}
            </Button>
          </Link>
          {pendingInvoices.length > 0 && (
            <Link to="/invoices">
              <Button variant="signal">
                <CreditCard className="h-4 w-4 mr-1.5" /> Pay Invoice ({pendingInvoices.length})
              </Button>
            </Link>
          )}
          <Link to="/workbench">
            <Button variant="ghost">Back to All Projects</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
