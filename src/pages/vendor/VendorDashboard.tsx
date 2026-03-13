import { Link } from "react-router-dom";
import { FileText, FolderKanban, Clock, CheckCircle2, AlertCircle, ArrowRight, DollarSign } from "lucide-react";
import { useVendorAuth } from "@/lib/vendor-auth";
import { useProjects } from "@/lib/projects";

const STAGES = ["brief", "matched", "sample", "production", "shipped", "complete"] as const;

export default function VendorDashboard() {
  const { vendorProfile } = useVendorAuth();
  const { threads, invoices } = useProjects();

  // Filter projects for this vendor
  const vendorProjects = threads.filter((t) => t.vendor === vendorProfile.factoryName);
  const pendingBriefs = vendorProjects.filter((t) => t.stage === "brief");
  const activeProjects = vendorProjects.filter((t) => !["brief", "complete"].includes(t.stage));
  const completedProjects = vendorProjects.filter((t) => t.stage === "complete");

  const vendorInvoices = invoices.filter((i) => i.vendor === vendorProfile.factoryName);
  const pendingRevenue = vendorInvoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const paidRevenue = vendorInvoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      {/* Header */}
      <section className="border-b border-foreground/10">
        <div className="p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Dashboard</p>
          <h1 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight">
            Welcome back, {vendorProfile.contactName?.split(" ")[0] || "Vendor"}
          </h1>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-foreground/10">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-foreground/10">
          <StatCard icon={FileText} label="Pending Briefs" value={pendingBriefs.length} accent={pendingBriefs.length > 0} />
          <StatCard icon={FolderKanban} label="Active Projects" value={activeProjects.length} />
          <StatCard icon={DollarSign} label="Pending Revenue" value={`$${pendingRevenue.toLocaleString()}`} />
          <StatCard icon={CheckCircle2} label="Completed" value={completedProjects.length} />
        </div>
      </section>

      {/* Action items */}
      <section className="p-6 md:p-8">
        <h2 className="font-display text-sm font-700 uppercase tracking-tight mb-4">Action Required</h2>

        {pendingBriefs.length > 0 ? (
          <div className="space-y-2 mb-8">
            {pendingBriefs.map((brief) => (
              <div key={brief.id} className="flex items-center justify-between p-4 border border-signal/20 bg-signal/5">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-4 w-4 text-signal flex-shrink-0" />
                  <div>
                    <p className="font-body text-sm font-600">{brief.product}</p>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                      {brief.labelName} · {brief.quantity} units · {brief.updated}
                    </p>
                  </div>
                </div>
                <Link
                  to="/vendor/briefs"
                  className="font-mono text-[10px] text-signal uppercase tracking-wider flex items-center gap-1 hover:text-signal/80 transition-colors"
                >
                  Review <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-8">
            No pending briefs — you're all caught up
          </p>
        )}

        {/* Active projects */}
        <h2 className="font-display text-sm font-700 uppercase tracking-tight mb-4">Active Projects</h2>
        {activeProjects.length > 0 ? (
          <div className="space-y-px bg-foreground/10">
            {activeProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-background">
                <div>
                  <p className="font-body text-sm font-600">{project.product}</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                    {project.labelName} · Stage: {project.stage}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StageIndicator stage={project.stage} />
                  <Link
                    to="/vendor/projects"
                    className="font-mono text-[10px] text-signal uppercase tracking-wider flex items-center gap-1 hover:text-signal/80 transition-colors"
                  >
                    Manage <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            No active projects
          </p>
        )}

        {/* Revenue summary */}
        <div className="mt-8 p-5 border border-foreground/10">
          <h2 className="font-display text-sm font-700 uppercase tracking-tight mb-3">Revenue</h2>
          <div className="flex items-center gap-8">
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Paid</p>
              <p className="font-display text-xl font-800">${paidRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Pending</p>
              <p className="font-display text-xl font-800 text-signal">${pendingRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="p-5">
      <Icon className={`h-4 w-4 mb-2 ${accent ? "text-signal" : "text-muted-foreground"}`} />
      <p className={`font-display text-2xl font-800 ${accent ? "text-signal" : ""}`}>{value}</p>
      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

function StageIndicator({ stage }: { stage: string }) {
  const idx = STAGES.indexOf(stage as any);
  return (
    <div className="flex gap-0.5">
      {STAGES.slice(0, 5).map((_, i) => (
        <div key={i} className={`w-3 h-1.5 ${i <= idx ? "bg-foreground" : "bg-foreground/10"}`} />
      ))}
    </div>
  );
}
