import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ProjectFile {
  id: number;
  projectId: number;
  name: string;
  type: "tech-pack" | "spec-sheet" | "design" | "contract" | "other";
  uploadedBy: "brand" | "vendor";
  date: string;
  size: string;
}

export interface TrackingEvent {
  date: string;
  location: string;
  status: string;
}

export interface ShipmentTracking {
  projectId: number;
  carrier: string;
  trackingNumber: string;
  status: "label-created" | "picked-up" | "in-transit" | "out-for-delivery" | "delivered";
  estimatedDelivery?: string;
  events: TrackingEvent[];
}

export interface Dispute {
  id: number;
  projectId: number;
  type: "quality" | "shortage" | "late-delivery" | "other";
  status: "open" | "under-review" | "resolved";
  filedBy: "brand" | "vendor";
  description: string;
  date: string;
  resolution?: string;
}

export interface Contract {
  projectId: number;
  status: "draft" | "brand-signed" | "vendor-signed" | "active";
  moq: string;
  unitPrice: string;
  deliveryDate: string;
  terms: string;
  brandAccepted: boolean;
  vendorAccepted: boolean;
}

export interface Amendment {
  id: number;
  projectId: number;
  type: "quantity" | "specs" | "timeline" | "pricing";
  description: string;
  requestedBy: "brand" | "vendor";
  status: "pending" | "approved" | "rejected";
  date: string;
}

// Seed data
const SEED_FILES: ProjectFile[] = [
  { id: 1, projectId: 1, name: "FW26_Hoodie_TechPack_v2.pdf", type: "tech-pack", uploadedBy: "brand", date: "Feb 12", size: "2.4 MB" },
  { id: 2, projectId: 1, name: "Hoodie_Colorways_Reference.png", type: "design", uploadedBy: "brand", date: "Feb 14", size: "1.1 MB" },
  { id: 3, projectId: 1, name: "Stone_Wash_Swatch.jpg", type: "spec-sheet", uploadedBy: "vendor", date: "Feb 20", size: "850 KB" },
  { id: 4, projectId: 2, name: "Heavy_Tee_420gsm_Specs.pdf", type: "spec-sheet", uploadedBy: "vendor", date: "Jan 22", size: "1.8 MB" },
  { id: 5, projectId: 2, name: "Blank_Tee_TechPack.pdf", type: "tech-pack", uploadedBy: "brand", date: "Jan 20", size: "3.2 MB" },
  { id: 6, projectId: 3, name: "Selvedge_Denim_Specs.pdf", type: "spec-sheet", uploadedBy: "brand", date: "Mar 1", size: "2.0 MB" },
  { id: 7, projectId: 5, name: "Merino_Cardigan_TechPack.pdf", type: "tech-pack", uploadedBy: "brand", date: "Jan 5", size: "4.1 MB" },
  { id: 8, projectId: 5, name: "Knit_Gauge_Samples.jpg", type: "design", uploadedBy: "vendor", date: "Jan 15", size: "920 KB" },
  { id: 9, projectId: 6, name: "Linen_Camp_Shirt_Final_TechPack.pdf", type: "tech-pack", uploadedBy: "brand", date: "Nov 15", size: "3.8 MB" },
  { id: 10, projectId: 6, name: "Production_Contract_Kyoto.pdf", type: "contract", uploadedBy: "vendor", date: "Nov 20", size: "540 KB" },
];

const SEED_TRACKING: ShipmentTracking[] = [
  {
    projectId: 5,
    carrier: "Turkish Airlines Cargo",
    trackingNumber: "TK-88291",
    status: "in-transit",
    estimatedDelivery: "Mar 16",
    events: [
      { date: "Mar 1, 09:00", location: "Istanbul, TR", status: "Package picked up" },
      { date: "Mar 1, 14:30", location: "Istanbul Airport, TR", status: "Departed facility" },
      { date: "Mar 2, 06:00", location: "Frankfurt, DE", status: "In transit — hub transfer" },
      { date: "Mar 3, 11:00", location: "JFK Airport, US", status: "Arrived at destination country" },
    ],
  },
  {
    projectId: 6,
    carrier: "Nippon Express",
    trackingNumber: "NX-44517",
    status: "delivered",
    events: [
      { date: "Feb 1, 08:00", location: "Osaka, JP", status: "Package picked up" },
      { date: "Feb 3, 16:00", location: "Port of Osaka, JP", status: "Departed port" },
      { date: "Feb 10, 09:00", location: "Port of LA, US", status: "Arrived — customs clearance" },
      { date: "Feb 12, 14:00", location: "Los Angeles, US", status: "Customs cleared" },
      { date: "Feb 15, 10:00", location: "Warehouse, US", status: "Delivered — signed by receiver" },
    ],
  },
];

const SEED_DISPUTES: Dispute[] = [];

const SEED_CONTRACTS: Contract[] = [
  { projectId: 1, status: "brand-signed", moq: "200", unitPrice: "$28.50", deliveryDate: "Apr 15, 2026", terms: "50% deposit on production start, 50% balance before shipping. Samples at cost. 14-day quality dispute window.", brandAccepted: true, vendorAccepted: false },
  { projectId: 2, status: "active", moq: "500", unitPrice: "$15.00", deliveryDate: "Mar 30, 2026", terms: "50/50 split. FOB Shenzhen. 48-hour escrow release after delivery confirmation.", brandAccepted: true, vendorAccepted: true },
  { projectId: 5, status: "active", moq: "250", unitPrice: "$34.00", deliveryDate: "Mar 10, 2026", terms: "Full payment on production completion. Air freight included. 14-day dispute window.", brandAccepted: true, vendorAccepted: true },
  { projectId: 6, status: "active", moq: "400", unitPrice: "$30.00", deliveryDate: "Feb 15, 2026", terms: "Full payment on production completion. Sea freight, buyer pays customs. 48-hour escrow release.", brandAccepted: true, vendorAccepted: true },
];

const SEED_AMENDMENTS: Amendment[] = [
  { id: 1, projectId: 1, type: "specs", description: "Add stone wash colorway to original 2-color program", requestedBy: "brand", status: "approved", date: "Feb 20" },
  { id: 2, projectId: 2, type: "quantity", description: "Increase order from 400 to 500 units", requestedBy: "brand", status: "approved", date: "Feb 10" },
];

interface ProjectFeaturesContextType {
  files: ProjectFile[];
  tracking: ShipmentTracking[];
  disputes: Dispute[];
  contracts: Contract[];
  amendments: Amendment[];
  addFile: (file: Omit<ProjectFile, "id">) => void;
  addTracking: (t: ShipmentTracking) => void;
  updateTrackingStatus: (projectId: number, status: ShipmentTracking["status"]) => void;
  fileDispute: (d: Omit<Dispute, "id">) => void;
  resolveDispute: (id: number, resolution: string) => void;
  signContract: (projectId: number, party: "brand" | "vendor") => void;
  requestAmendment: (a: Omit<Amendment, "id">) => void;
  respondAmendment: (id: number, status: "approved" | "rejected") => void;
}

const ProjectFeaturesContext = createContext<ProjectFeaturesContextType | null>(null);

let nextFileId = 100;
let nextDisputeId = 100;
let nextAmendmentId = 100;

export function ProjectFeaturesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<ProjectFile[]>(SEED_FILES);
  const [tracking, setTracking] = useState<ShipmentTracking[]>(SEED_TRACKING);
  const [disputes, setDisputes] = useState<Dispute[]>(SEED_DISPUTES);
  const [contracts, setContracts] = useState<Contract[]>(SEED_CONTRACTS);
  const [amendments, setAmendments] = useState<Amendment[]>(SEED_AMENDMENTS);

  const addFile = useCallback((file: Omit<ProjectFile, "id">) => {
    setFiles(prev => [...prev, { ...file, id: nextFileId++ }]);
  }, []);

  const addTracking = useCallback((t: ShipmentTracking) => {
    setTracking(prev => [...prev.filter(x => x.projectId !== t.projectId), t]);
  }, []);

  const updateTrackingStatus = useCallback((projectId: number, status: ShipmentTracking["status"]) => {
    setTracking(prev => prev.map(t => t.projectId === projectId ? { ...t, status } : t));
  }, []);

  const fileDispute = useCallback((d: Omit<Dispute, "id">) => {
    setDisputes(prev => [...prev, { ...d, id: nextDisputeId++ }]);
  }, []);

  const resolveDispute = useCallback((id: number, resolution: string) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "resolved" as const, resolution } : d));
  }, []);

  const signContract = useCallback((projectId: number, party: "brand" | "vendor") => {
    setContracts(prev => prev.map(c => {
      if (c.projectId !== projectId) return c;
      const updated = { ...c };
      if (party === "brand") updated.brandAccepted = true;
      if (party === "vendor") updated.vendorAccepted = true;
      if (updated.brandAccepted && updated.vendorAccepted) updated.status = "active";
      else if (updated.brandAccepted) updated.status = "brand-signed";
      else if (updated.vendorAccepted) updated.status = "vendor-signed";
      return updated;
    }));
  }, []);

  const requestAmendment = useCallback((a: Omit<Amendment, "id">) => {
    setAmendments(prev => [...prev, { ...a, id: nextAmendmentId++ }]);
  }, []);

  const respondAmendment = useCallback((id: number, status: "approved" | "rejected") => {
    setAmendments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  return (
    <ProjectFeaturesContext.Provider value={{ files, tracking, disputes, contracts, amendments, addFile, addTracking, updateTrackingStatus, fileDispute, resolveDispute, signContract, requestAmendment, respondAmendment }}>
      {children}
    </ProjectFeaturesContext.Provider>
  );
}

export function useProjectFeatures() {
  const ctx = useContext(ProjectFeaturesContext);
  if (!ctx) throw new Error("useProjectFeatures must be used within ProjectFeaturesProvider");
  return ctx;
}
