import { createContext, useContext, useState, ReactNode } from "react";

export interface Vendor {
  id: number;
  name: string;
  region: string;
  category: string;
  qualityVsCost: number; // 1 = lower cost … 5 = top quality
  summary: string;
}

export const VENDORS: Vendor[] = [
  // US (10)
  { id: 1, name: "Brooklyn Garment Dist.", region: "US", category: "Denim", qualityVsCost: 3, summary: "Brooklyn denim specialist with heritage construction methods." },
  { id: 2, name: "LA Cut House", region: "US", category: "Private Label", qualityVsCost: 3, summary: "Full-service private label production based in Los Angeles." },
  { id: 3, name: "Portland Sew Co.", region: "US", category: "Cut & Sew", qualityVsCost: 3, summary: "Small-batch cut and sew with focus on streetwear silhouettes." },
  { id: 4, name: "SF Knitwear Studio", region: "US", category: "Knitwear", qualityVsCost: 5, summary: "San Francisco-based luxury knitwear with sustainable sourcing." },
  { id: 5, name: "Chicago Fleece Mill", region: "US", category: "Fleece", qualityVsCost: 3, summary: "Midweight and heavyweight fleece specialist for contemporary brands." },
  { id: 6, name: "NYC Atelier Group", region: "US", category: "Cut & Sew", qualityVsCost: 5, summary: "High-end cut and sew atelier serving luxury streetwear labels." },
  { id: 7, name: "Dallas Denim Works", region: "US", category: "Denim", qualityVsCost: 2, summary: "Large-scale denim production with custom wash capabilities." },
  { id: 8, name: "Miami Private Label Co.", region: "US", category: "Private Label", qualityVsCost: 2, summary: "Turn-key private label solutions with fast turnaround." },
  { id: 9, name: "Seattle Textile Lab", region: "US", category: "Heavyweight Jersey", qualityVsCost: 3, summary: "Heavyweight jersey and terry specializing in oversized cuts." },
  { id: 10, name: "Austin Garment Works", region: "US", category: "Cut & Sew", qualityVsCost: 3, summary: "Boutique cut and sew shop with rapid prototyping capability." },
  // PT (10)
  { id: 11, name: "Ateliê Nova", region: "PT", category: "Cut & Sew", qualityVsCost: 3, summary: "Lisbon-based atelier specializing in premium cut-and-sew." },
  { id: 12, name: "Porto Fleece Works", region: "PT", category: "Fleece", qualityVsCost: 3, summary: "Porto-based fleece manufacturer with organic certification." },
  { id: 13, name: "Fábrica do Minho", region: "PT", category: "Knitwear", qualityVsCost: 5, summary: "Northern Portugal knitwear factory with 40+ years heritage." },
  { id: 14, name: "Lisboa Denim House", region: "PT", category: "Denim", qualityVsCost: 4, summary: "Premium Portuguese denim with artisanal wash techniques." },
  { id: 15, name: "Braga Jersey Co.", region: "PT", category: "Heavyweight Jersey", qualityVsCost: 3, summary: "Heavyweight jersey production with enzyme wash specialization." },
  { id: 16, name: "Guimarães Textiles", region: "PT", category: "Cut & Sew", qualityVsCost: 3, summary: "Heritage textile house producing for European fashion brands." },
  { id: 17, name: "Coimbra Knit Studio", region: "PT", category: "Knitwear", qualityVsCost: 3, summary: "Modern knitwear production with Italian yarn partnerships." },
  { id: 18, name: "Algarve Private Label", region: "PT", category: "Private Label", qualityVsCost: 3, summary: "Full-package private label with in-house design consultation." },
  { id: 19, name: "Setúbal Fleece Mill", region: "PT", category: "Fleece", qualityVsCost: 4, summary: "Organic fleece specialist with GOTS and OEKO-TEX certifications." },
  { id: 20, name: "Aveiro Garment Lab", region: "PT", category: "Cut & Sew", qualityVsCost: 5, summary: "Precision garment production for luxury streetwear labels." },
  // CN (10)
  { id: 21, name: "Shenzhen Textile Co.", region: "CN", category: "Heavyweight Jersey", qualityVsCost: 4, summary: "Large-scale heavyweight jersey production with luxury finishing." },
  { id: 22, name: "Guangzhou Knit Mill", region: "CN", category: "Knitwear", qualityVsCost: 4, summary: "Precision knitwear mill supporting complex patterns and yarns." },
  { id: 23, name: "Dongguan Dye Works", region: "CN", category: "Cut & Sew", qualityVsCost: 2, summary: "Specializing in garment-dyed cut and sew with color lab." },
  { id: 24, name: "Shanghai Cut & Sew", region: "CN", category: "Cut & Sew", qualityVsCost: 4, summary: "Luxury-tier cut and sew with international certifications." },
  { id: 25, name: "Hangzhou Denim Co.", region: "CN", category: "Denim", qualityVsCost: 3, summary: "Selvedge and raw denim with Japanese-style finishing." },
  { id: 26, name: "Ningbo Fleece Group", region: "CN", category: "Fleece", qualityVsCost: 2, summary: "High-volume fleece with polar and sherpa capabilities." },
  { id: 27, name: "Foshan Private Label", region: "CN", category: "Private Label", qualityVsCost: 1, summary: "End-to-end private label manufacturing with packaging." },
  { id: 28, name: "Qingdao Jersey Works", region: "CN", category: "Heavyweight Jersey", qualityVsCost: 2, summary: "Midweight to heavyweight jersey with garment dye expertise." },
  { id: 29, name: "Suzhou Knitwear Lab", region: "CN", category: "Knitwear", qualityVsCost: 3, summary: "Technical knitwear with seamless and whole-garment capability." },
  { id: 30, name: "Xiamen Garment Co.", region: "CN", category: "Cut & Sew", qualityVsCost: 2, summary: "Scale cut and sew with integrated quality control." },
  // IN (10)
  { id: 31, name: "Mumbai Cotton Works", region: "IN", category: "Cut & Sew", qualityVsCost: 2, summary: "Organic cotton specialists with vertically integrated spinning and sewing." },
  { id: 32, name: "Tirupur Knit Exports", region: "IN", category: "Knitwear", qualityVsCost: 2, summary: "India's knitwear capital — high-volume knits with GOTS certification." },
  { id: 33, name: "Jaipur Textile House", region: "IN", category: "Private Label", qualityVsCost: 3, summary: "Full-package private label with hand block print and embroidery capabilities." },
  { id: 34, name: "Bangalore Denim Mill", region: "IN", category: "Denim", qualityVsCost: 3, summary: "Premium denim production with sustainable water recycling systems." },
  { id: 35, name: "Delhi Garment Studio", region: "IN", category: "Tailoring", qualityVsCost: 5, summary: "Luxury tailoring and structured garments with hand-finishing expertise." },
  { id: 36, name: "Noida Activewear Co.", region: "IN", category: "Activewear", qualityVsCost: 2, summary: "Performance fabrics and activewear with moisture-wicking technology." },
  { id: 37, name: "Ahmedabad Jersey Lab", region: "IN", category: "Heavyweight Jersey", qualityVsCost: 3, summary: "Heavyweight organic jersey with enzyme wash and vintage finishing." },
  { id: 38, name: "Coimbatore Fleece Mill", region: "IN", category: "Fleece", qualityVsCost: 2, summary: "Brushed and unbrushed fleece in organic cotton and recycled poly blends." },
  { id: 39, name: "Ludhiana Knit Works", region: "IN", category: "Knitwear", qualityVsCost: 4, summary: "Heritage knitwear factory specializing in cashmere blends and jacquards." },
  { id: 40, name: "Surat Embroidery House", region: "IN", category: "Accessories", qualityVsCost: 3, summary: "Embellishment and embroidery specialist for luxury detailing and patches." },
];

interface VendorActions {
  savedIds: number[];
  compareIds: number[];
  toggleSave: (id: number) => void;
  toggleCompare: (id: number) => void;
  isSaved: (id: number) => boolean;
  isComparing: (id: number) => boolean;
  clearCompare: () => void;
}

const VendorActionsContext = createContext<VendorActions | null>(null);

export function VendorActionsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [compareIds, setCompareIds] = useState<number[]>([]);

  const toggleSave = (id: number) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const toggleCompare = (id: number) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev; // max 3 for comparison
      return [...prev, id];
    });
  };

  const isSaved = (id: number) => savedIds.includes(id);
  const isComparing = (id: number) => compareIds.includes(id);
  const clearCompare = () => setCompareIds([]);

  return (
    <VendorActionsContext.Provider value={{ savedIds, compareIds, toggleSave, toggleCompare, isSaved, isComparing, clearCompare }}>
      {children}
    </VendorActionsContext.Provider>
  );
}

export function useVendorActions() {
  const ctx = useContext(VendorActionsContext);
  if (!ctx) throw new Error("useVendorActions must be used within VendorActionsProvider");
  return ctx;
}
