import { FileText, Check, Clock, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectFeatures } from "@/lib/project-features";
import { useToast } from "@/hooks/use-toast";

export function ContractPanel({ projectId, role }: { projectId: number; role: "brand" | "vendor" }) {
  const { contracts, signContract } = useProjectFeatures();
  const { toast } = useToast();
  const contract = contracts.find(c => c.projectId === projectId);

  if (!contract) return null;

  const hasSigned = role === "brand" ? contract.brandAccepted : contract.vendorAccepted;
  const otherSigned = role === "brand" ? contract.vendorAccepted : contract.brandAccepted;

  const handleSign = () => {
    signContract(projectId, role);
    toast({ title: "Contract signed", description: contract.status === "draft" || !otherSigned ? "Awaiting countersignature." : "Both parties have agreed — contract is now active." });
  };

  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between p-3 border-b border-foreground/10 bg-muted/30">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Contract & Terms</span>
        </div>
        <span className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 ${
          contract.status === "active" ? "bg-foreground/5 text-foreground" : "bg-signal/10 text-signal"
        }`}>
          {contract.status === "active" ? "Active" : contract.status === "draft" ? "Draft" : "Awaiting Signature"}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Terms grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">MOQ</p>
            <p className="font-body text-sm font-600">{contract.moq} units</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Unit Price</p>
            <p className="font-body text-sm font-600">{contract.unitPrice}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Delivery Date</p>
            <p className="font-body text-sm font-600">{contract.deliveryDate}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-0.5">Status</p>
            <p className="font-body text-sm font-600 capitalize">{contract.status.replace("-", " ")}</p>
          </div>
        </div>

        {/* Terms text */}
        <div className="p-3 bg-muted/30 border border-foreground/5">
          <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider mb-1">Payment & Delivery Terms</p>
          <p className="font-body text-xs text-foreground/70 leading-relaxed">{contract.terms}</p>
        </div>

        {/* Signature status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            {contract.brandAccepted ? (
              <Check className="h-3.5 w-3.5 text-foreground" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
            )}
            <span className={`font-mono text-[9px] uppercase tracking-wider ${contract.brandAccepted ? "text-foreground" : "text-muted-foreground/40"}`}>
              Brand {contract.brandAccepted ? "signed" : "pending"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {contract.vendorAccepted ? (
              <Check className="h-3.5 w-3.5 text-foreground" />
            ) : (
              <Clock className="h-3.5 w-3.5 text-muted-foreground/40" />
            )}
            <span className={`font-mono text-[9px] uppercase tracking-wider ${contract.vendorAccepted ? "text-foreground" : "text-muted-foreground/40"}`}>
              Vendor {contract.vendorAccepted ? "signed" : "pending"}
            </span>
          </div>
        </div>

        {/* Sign button */}
        {!hasSigned && (
          <Button variant="editorial" size="sm" onClick={handleSign} className="w-full font-mono text-[10px]">
            <Pen className="h-3 w-3 mr-1.5" /> Sign & Accept Terms
          </Button>
        )}
      </div>
    </div>
  );
}
