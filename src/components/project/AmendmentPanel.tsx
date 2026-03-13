import { useState } from "react";
import { RefreshCw, Check, X, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectFeatures, type Amendment } from "@/lib/project-features";
import { useToast } from "@/hooks/use-toast";

const TYPE_LABELS: Record<Amendment["type"], string> = {
  quantity: "Quantity Change",
  specs: "Spec Update",
  timeline: "Timeline Change",
  pricing: "Pricing Adjustment",
};

export function AmendmentPanel({ projectId, role }: { projectId: number; role: "brand" | "vendor" }) {
  const { amendments, requestAmendment, respondAmendment } = useProjectFeatures();
  const { toast } = useToast();
  const [requesting, setRequesting] = useState(false);
  const [form, setForm] = useState({ type: "quantity" as Amendment["type"], description: "" });

  const projectAmendments = amendments.filter(a => a.projectId === projectId);

  const handleRequest = () => {
    if (!form.description.trim()) return;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    requestAmendment({
      projectId,
      type: form.type,
      description: form.description,
      requestedBy: role,
      status: "pending",
      date: today,
    });
    setForm({ type: "quantity", description: "" });
    setRequesting(false);
    toast({ title: "Amendment requested", description: "The other party will be notified for approval." });
  };

  const handleRespond = (id: number, status: "approved" | "rejected") => {
    respondAmendment(id, status);
    toast({ title: status === "approved" ? "Amendment approved" : "Amendment rejected", description: status === "approved" ? "Changes have been applied to the project." : "The requesting party will be notified." });
  };

  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between p-3 border-b border-foreground/10 bg-muted/30">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Order Amendments {projectAmendments.length > 0 && `(${projectAmendments.length})`}
          </span>
        </div>
        {!requesting && (
          <Button variant="ghost" size="sm" onClick={() => setRequesting(true)} className="h-7 px-2 font-mono text-[9px]">
            <Plus className="h-3 w-3 mr-1" /> Request Change
          </Button>
        )}
      </div>

      {requesting && (
        <div className="p-4 border-b border-foreground/10 bg-signal/5 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-signal">New Amendment Request</p>
          <select
            value={form.type}
            onChange={e => setForm(prev => ({ ...prev, type: e.target.value as Amendment["type"] }))}
            className="w-full bg-background border border-foreground/10 px-3 py-2 font-body text-sm"
          >
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the change you need…"
            className="w-full bg-background border border-foreground/10 px-3 py-2 font-body text-sm min-h-[60px] resize-none"
          />
          <div className="flex gap-2">
            <Button variant="editorial" size="sm" onClick={handleRequest} disabled={!form.description.trim()} className="font-mono text-[9px]">
              Submit Request
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setRequesting(false)} className="font-mono text-[9px]">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {projectAmendments.length > 0 ? (
        <div className="divide-y divide-foreground/5">
          {projectAmendments.map(a => (
            <div key={a.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-mono text-[9px] px-2 py-0.5 uppercase tracking-wider ${
                  a.status === "pending" ? "bg-signal/10 text-signal" :
                  a.status === "approved" ? "bg-foreground/5 text-foreground" :
                  "bg-destructive/10 text-destructive"
                }`}>
                  {a.status}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">{TYPE_LABELS[a.type]}</span>
                <span className="font-mono text-[9px] text-muted-foreground ml-auto">{a.date}</span>
              </div>
              <p className="font-body text-sm text-foreground/80 mb-2">{a.description}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-muted-foreground">
                  Requested by {a.requestedBy === "brand" ? "Brand" : "Vendor"}
                </span>
                {a.status === "pending" && a.requestedBy !== role && (
                  <div className="ml-auto flex gap-1.5">
                    <Button variant="editorial" size="sm" onClick={() => handleRespond(a.id, "approved")} className="h-6 px-2 font-mono text-[9px]">
                      <Check className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRespond(a.id, "rejected")} className="h-6 px-2 font-mono text-[9px]">
                      <X className="h-3 w-3 mr-1" /> Reject
                    </Button>
                  </div>
                )}
                {a.status === "pending" && a.requestedBy === role && (
                  <span className="ml-auto font-mono text-[9px] text-signal flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Awaiting response
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : !requesting ? (
        <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider text-center py-6">
          No amendments requested
        </p>
      ) : null}
    </div>
  );
}
