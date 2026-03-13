import { useState } from "react";
import { Check, X, Clock, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorAuth } from "@/lib/vendor-auth";
import { useProjects } from "@/lib/projects";
import { QualityScale } from "@/components/QualityScale";

type BriefStatus = "pending" | "accepted" | "declined";

export default function VendorBriefs() {
  const { vendorProfile } = useVendorAuth();
  const { threads } = useProjects();
  const [briefStatuses, setBriefStatuses] = useState<Record<number, BriefStatus>>({});

  // All briefs for this vendor (stage = brief or matched)
  const vendorBriefs = threads.filter(
    (t) => t.vendor === vendorProfile.factoryName && ["brief", "matched"].includes(t.stage)
  );

  // Also show simulated "match" briefs that aren't directly assigned
  const matchedBriefs = threads.filter(
    (t) => t.vendor !== vendorProfile.factoryName && t.stage === "brief" && 
    t.category && vendorProfile.categories.includes(t.category)
  );

  const allBriefs = [
    ...vendorBriefs.map((b) => ({ ...b, source: "direct" as const })),
    ...matchedBriefs.slice(0, 3).map((b) => ({ ...b, source: "match" as const })),
  ];

  const handleAction = (id: number, action: BriefStatus) => {
    setBriefStatuses((prev) => ({ ...prev, [id]: action }));
  };

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Incoming</p>
          <h1 className="font-display text-2xl font-800 uppercase tracking-tight">Briefs</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Review incoming briefs from brands — direct submissions and algorithmic matches.
          </p>
        </div>
      </section>

      <section className="p-6 md:p-8">
        {allBriefs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-6 w-6 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">No incoming briefs</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allBriefs.map((brief) => {
              const status = briefStatuses[brief.id];
              return (
                <div key={`${brief.source}-${brief.id}`} className="border border-foreground/10 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-[9px] px-2 py-0.5 uppercase tracking-wider ${
                          brief.source === "direct"
                            ? "bg-foreground text-background"
                            : "bg-signal/10 text-signal border border-signal/20"
                        }`}>
                          {brief.source === "direct" ? "Direct" : "Match"}
                        </span>
                        {brief.matchScore && (
                          <span className="font-mono text-[10px] text-signal">{brief.matchScore}% match</span>
                        )}
                      </div>
                      <h3 className="font-body text-sm font-600">{brief.product}</h3>
                      <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                        {brief.labelName} · {brief.category} · {brief.quantity} units
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">{brief.updated}</span>
                  </div>

                  {brief.qualityVsCost && (
                    <div className="mb-3">
                      <QualityScale value={brief.qualityVsCost} />
                    </div>
                  )}

                  {/* Timeline preview */}
                  {brief.timeline.length > 0 && (
                    <p className="font-body text-xs text-muted-foreground mb-4">
                      {brief.timeline[brief.timeline.length - 1].note}
                    </p>
                  )}

                  {/* Actions */}
                  {status ? (
                    <div className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider ${
                      status === "accepted" ? "text-green-600" : status === "declined" ? "text-muted-foreground" : ""
                    }`}>
                      {status === "accepted" ? (
                        <><Check className="h-3 w-3" /> Accepted — moved to projects</>
                      ) : (
                        <><X className="h-3 w-3" /> Declined</>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-2 border-t border-foreground/5">
                      <Button
                        variant="editorial"
                        size="sm"
                        onClick={() => handleAction(brief.id, "accepted")}
                        className="font-mono text-[10px]"
                      >
                        <Check className="h-3 w-3 mr-1" /> Accept Brief
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(brief.id, "declined")}
                        className="font-mono text-[10px]"
                      >
                        <X className="h-3 w-3 mr-1" /> Decline
                      </Button>
                      <span className="font-mono text-[9px] text-muted-foreground ml-auto flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Respond within 48h
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
