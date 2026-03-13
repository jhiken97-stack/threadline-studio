import { FileText, Check, Package, Clock, Truck } from "lucide-react";

export const STAGES = [
  { key: "brief", label: "Brief Sent", icon: FileText, help: "Project details shared with the manufacturer for review." },
  { key: "matched", label: "Vendor Matched", icon: Check, help: "Manufacturer accepted. Discuss details and request samples." },
  { key: "sample", label: "Sampling", icon: Package, help: "Sample pieces being created. Brand approves before bulk." },
  { key: "production", label: "In Production", icon: Clock, help: "Bulk manufacturing in progress. QC and balance due before shipping." },
  { key: "shipped", label: "Shipping", icon: Truck, help: "Finished goods shipped and in transit." },
  { key: "complete", label: "Delivered", icon: Check, help: "Order delivered. Escrow released after dispute window." },
] as const;

export const SUB_STEPS: Record<string, { label: string; steps: string[] }> = {
  brief: {
    label: "Briefing",
    steps: ["Brief submitted", "Brief reviewed by vendor", "Brief accepted"],
  },
  matched: {
    label: "Matching",
    steps: ["Vendor paired", "Terms & specs discussed", "Terms agreed"],
  },
  sample: {
    label: "Sampling",
    steps: ["Sample request form", "Samples agreed upon", "Samples paid for", "Samples shipped", "Samples delivered"],
  },
  production: {
    label: "Production",
    steps: ["Production deposit paid (50%)", "Production started", "Mid-production update", "Production complete", "Final quality check", "Production balance paid (50%)"],
  },
  shipped: {
    label: "Shipping",
    steps: ["Tracking number provided", "Order shipped", "In transit", "Tracking shows delivered"],
  },
  complete: {
    label: "Complete",
    steps: ["Tracking shows delivered", "Escrow auto-released", "Dispute window (48h)", "Review submitted"],
  },
};

export function isPaymentStep(label: string): boolean {
  const l = label.toLowerCase();
  return l.includes("paid") || l.includes("payment") || l.includes("deposit") || l.includes("balance");
}
