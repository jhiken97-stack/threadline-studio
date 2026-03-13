import { Truck, MapPin, Check, Clock, ExternalLink } from "lucide-react";
import { useProjectFeatures } from "@/lib/project-features";

const STATUS_LABELS: Record<string, string> = {
  "label-created": "Label Created",
  "picked-up": "Picked Up",
  "in-transit": "In Transit",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
};

const STATUS_ORDER = ["label-created", "picked-up", "in-transit", "out-for-delivery", "delivered"];

export function ShipmentTracker({ projectId }: { projectId: number }) {
  const { tracking } = useProjectFeatures();
  const shipment = tracking.find(t => t.projectId === projectId);

  if (!shipment) return null;

  const currentIdx = STATUS_ORDER.indexOf(shipment.status);

  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between p-3 border-b border-foreground/10 bg-muted/30">
        <div className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Shipment Tracking</span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-signal/10 text-signal">
          {STATUS_LABELS[shipment.status]}
        </span>
      </div>

      <div className="p-4">
        {/* Carrier info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-body text-sm font-600">{shipment.carrier}</p>
            <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
              {shipment.trackingNumber}
              <ExternalLink className="h-2.5 w-2.5" />
            </p>
          </div>
          {shipment.estimatedDelivery && (
            <div className="text-right">
              <p className="font-mono text-[9px] text-muted-foreground uppercase">Est. Delivery</p>
              <p className="font-body text-sm font-600">{shipment.estimatedDelivery}</p>
            </div>
          )}
        </div>

        {/* Status progress bar */}
        <div className="flex items-center gap-0 mb-4">
          {STATUS_ORDER.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-3 h-3 flex items-center justify-center flex-shrink-0 ${
                i <= currentIdx
                  ? i === currentIdx ? "bg-signal" : "bg-foreground"
                  : "bg-foreground/10"
              }`}>
                {i < currentIdx && <Check className="h-2 w-2 text-background" />}
              </div>
              {i < STATUS_ORDER.length - 1 && (
                <div className={`h-px w-full ${i < currentIdx ? "bg-foreground" : "bg-foreground/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Events timeline */}
        <div className="space-y-0">
          {shipment.events.slice().reverse().map((event, i) => (
            <div key={i} className="flex gap-3 py-2 border-t border-foreground/5 first:border-0">
              <div className="flex-shrink-0 mt-0.5">
                {i === 0 ? (
                  <Clock className="h-3 w-3 text-signal" />
                ) : (
                  <MapPin className="h-3 w-3 text-muted-foreground/40" />
                )}
              </div>
              <div>
                <p className={`font-body text-xs ${i === 0 ? "font-600" : "text-muted-foreground"}`}>{event.status}</p>
                <p className="font-mono text-[9px] text-muted-foreground">{event.location} · {event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
