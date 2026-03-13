import { useState } from "react";
import { AlertTriangle, Check, Clock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectFeatures, type Dispute } from "@/lib/project-features";
import { useToast } from "@/hooks/use-toast";

const TYPE_LABELS: Record<Dispute["type"], string> = {
  quality: "Quality Issue",
  shortage: "Shortage / Missing Items",
  "late-delivery": "Late Delivery",
  other: "Other",
};

export function DisputePanel({ projectId, role }: { projectId: number; role: "brand" | "vendor" }) {
  const { disputes, fileDispute, resolveDispute } = useProjectFeatures();
  const { toast } = useToast();
  const [filing, setFiling] = useState(false);
  const [form, setForm] = useState({ type: "quality" as Dispute["type"], description: "" });

  const projectDisputes = disputes.filter(d => d.projectId === projectId);

  const handleFile = () => {
    if (!form.description.trim()) return;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    fileDispute({
      projectId,
      type: form.type,
      status: "open",
      filedBy: role,
      description: form.description,
      date: today,
    });
    setForm({ type: "quality", description: "" });
    setFiling(false);
    toast({ title: "Dispute filed", description: "The other party will be notified and platform review will begin." });
  };

  const handleResolve = (id: number) => {
    resolveDispute(id, "Resolved by mutual agreement.");
    toast({ title: "Dispute resolved", description: "Escrow will proceed as normal." });
  };

  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between p-3 border-b border-foreground/10 bg-muted/30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Disputes {projectDisputes.length > 0 && `(${projectDisputes.length})`}
          </span>
        </div>
        {!filing && (
          <Button variant="ghost" size="sm" onClick={() => setFiling(true)} className="h-7 px-2 font-mono text-[9px]">
            <AlertTriangle className="h-3 w-3 mr-1" /> File Dispute
          </Button>
        )}
      </div>

      {filing && (
        <div className="p-4 border-b border-foreground/10 bg-destructive/5 space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-destructive">New Dispute</p>
          <select
            value={form.type}
            onChange={e => setForm(prev => ({ ...prev, type: e.target.value as Dispute["type"] }))}
            className="w-full bg-background border border-foreground/10 px-3 py-2 font-body text-sm"
          >
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <textarea
            value={form.description}
            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the issue in detail…"
            className="w-full bg-background border border-foreground/10 px-3 py-2 font-body text-sm min-h-[80px] resize-none"
          />
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={handleFile} disabled={!form.description.trim()} className="font-mono text-[9px]">
              Submit Dispute
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setFiling(false)} className="font-mono text-[9px]">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {projectDisputes.length > 0 ? (
        <div className="divide-y divide-foreground/5">
          {projectDisputes.map(d => (
            <div key={d.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-mono text-[9px] px-2 py-0.5 uppercase tracking-wider ${
                  d.status === "open" ? "bg-destructive/10 text-destructive" :
                  d.status === "under-review" ? "bg-signal/10 text-signal" :
                  "bg-foreground/5 text-muted-foreground"
                }`}>
                  {d.status === "open" ? "Open" : d.status === "under-review" ? "Under Review" : "Resolved"}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground">{TYPE_LABELS[d.type]}</span>
                <span className="font-mono text-[9px] text-muted-foreground ml-auto">{d.date}</span>
              </div>
              <p className="font-body text-sm text-foreground/80 mb-2">{d.description}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-muted-foreground">Filed by {d.filedBy === "brand" ? "Brand" : "Vendor"}</span>
                {d.status === "resolved" && d.resolution && (
                  <span className="font-mono text-[9px] text-muted-foreground flex items-center gap-1">
                    <Check className="h-3 w-3" /> {d.resolution}
                  </span>
                )}
                {d.status === "open" && d.filedBy !== role && (
                  <Button variant="outline" size="sm" onClick={() => handleResolve(d.id)} className="ml-auto h-6 px-2 font-mono text-[9px]">
                    <Check className="h-3 w-3 mr-1" /> Accept Resolution
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : !filing ? (
        <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider text-center py-6">
          No disputes filed
        </p>
      ) : null}
    </div>
  );
}
