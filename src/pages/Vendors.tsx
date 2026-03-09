import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowUpRight, ArrowRight, Grid, List, Bookmark, GitCompare, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const REGIONS = ["All", "US", "PT", "CN"] as const;
const CATEGORIES = ["All", "Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim", "Private Label"] as const;
const TIERS = ["All", "Premium", "Luxury"] as const;

interface Vendor {
  id: number;
  name: string;
  region: string;
  category: string;
  tier: string;
  summary: string;
}

const VENDORS: Vendor[] = [
  // US (10)
  { id: 1, name: "Brooklyn Garment Dist.", region: "US", category: "Denim", tier: "Premium", summary: "Brooklyn denim specialist with heritage construction methods." },
  { id: 2, name: "LA Cut House", region: "US", category: "Private Label", tier: "Premium", summary: "Full-service private label production based in Los Angeles." },
  { id: 3, name: "Portland Sew Co.", region: "US", category: "Cut & Sew", tier: "Premium", summary: "Small-batch cut and sew with focus on streetwear silhouettes." },
  { id: 4, name: "SF Knitwear Studio", region: "US", category: "Knitwear", tier: "Luxury", summary: "San Francisco-based luxury knitwear with sustainable sourcing." },
  { id: 5, name: "Chicago Fleece Mill", region: "US", category: "Fleece", tier: "Premium", summary: "Midweight and heavyweight fleece specialist for contemporary brands." },
  { id: 6, name: "NYC Atelier Group", region: "US", category: "Cut & Sew", tier: "Luxury", summary: "High-end cut and sew atelier serving luxury streetwear labels." },
  { id: 7, name: "Dallas Denim Works", region: "US", category: "Denim", tier: "Premium", summary: "Large-scale denim production with custom wash capabilities." },
  { id: 8, name: "Miami Private Label Co.", region: "US", category: "Private Label", tier: "Premium", summary: "Turn-key private label solutions with fast turnaround." },
  { id: 9, name: "Seattle Textile Lab", region: "US", category: "Heavyweight Jersey", tier: "Premium", summary: "Heavyweight jersey and terry specializing in oversized cuts." },
  { id: 10, name: "Austin Garment Works", region: "US", category: "Cut & Sew", tier: "Premium", summary: "Boutique cut and sew shop with rapid prototyping capability." },
  // PT (10)
  { id: 11, name: "Ateliê Nova", region: "PT", category: "Cut & Sew", tier: "Premium", summary: "Lisbon-based atelier specializing in premium cut-and-sew." },
  { id: 12, name: "Porto Fleece Works", region: "PT", category: "Fleece", tier: "Premium", summary: "Porto-based fleece manufacturer with organic certification." },
  { id: 13, name: "Fábrica do Minho", region: "PT", category: "Knitwear", tier: "Luxury", summary: "Northern Portugal knitwear factory with 40+ years heritage." },
  { id: 14, name: "Lisboa Denim House", region: "PT", category: "Denim", tier: "Luxury", summary: "Premium Portuguese denim with artisanal wash techniques." },
  { id: 15, name: "Braga Jersey Co.", region: "PT", category: "Heavyweight Jersey", tier: "Premium", summary: "Heavyweight jersey production with enzyme wash specialization." },
  { id: 16, name: "Guimarães Textiles", region: "PT", category: "Cut & Sew", tier: "Premium", summary: "Heritage textile house producing for European fashion brands." },
  { id: 17, name: "Coimbra Knit Studio", region: "PT", category: "Knitwear", tier: "Premium", summary: "Modern knitwear production with Italian yarn partnerships." },
  { id: 18, name: "Algarve Private Label", region: "PT", category: "Private Label", tier: "Premium", summary: "Full-package private label with in-house design consultation." },
  { id: 19, name: "Setúbal Fleece Mill", region: "PT", category: "Fleece", tier: "Luxury", summary: "Organic fleece specialist with GOTS and OEKO-TEX certifications." },
  { id: 20, name: "Aveiro Garment Lab", region: "PT", category: "Cut & Sew", tier: "Luxury", summary: "Precision garment production for luxury streetwear labels." },
  // CN (10)
  { id: 21, name: "Shenzhen Textile Co.", region: "CN", category: "Heavyweight Jersey", tier: "Luxury", summary: "Large-scale heavyweight jersey production with luxury finishing." },
  { id: 22, name: "Guangzhou Knit Mill", region: "CN", category: "Knitwear", tier: "Luxury", summary: "Precision knitwear mill supporting complex patterns and yarns." },
  { id: 23, name: "Dongguan Dye Works", region: "CN", category: "Cut & Sew", tier: "Premium", summary: "Specializing in garment-dyed cut and sew with color lab." },
  { id: 24, name: "Shanghai Cut & Sew", region: "CN", category: "Cut & Sew", tier: "Luxury", summary: "Luxury-tier cut and sew with international certifications." },
  { id: 25, name: "Hangzhou Denim Co.", region: "CN", category: "Denim", tier: "Premium", summary: "Selvedge and raw denim with Japanese-style finishing." },
  { id: 26, name: "Ningbo Fleece Group", region: "CN", category: "Fleece", tier: "Premium", summary: "High-volume fleece with polar and sherpa capabilities." },
  { id: 27, name: "Foshan Private Label", region: "CN", category: "Private Label", tier: "Premium", summary: "End-to-end private label manufacturing with packaging." },
  { id: 28, name: "Qingdao Jersey Works", region: "CN", category: "Heavyweight Jersey", tier: "Premium", summary: "Midweight to heavyweight jersey with garment dye expertise." },
  { id: 29, name: "Suzhou Knitwear Lab", region: "CN", category: "Knitwear", tier: "Premium", summary: "Technical knitwear with seamless and whole-garment capability." },
  { id: 30, name: "Xiamen Garment Co.", region: "CN", category: "Cut & Sew", tier: "Premium", summary: "Scale cut and sew with integrated quality control." },
];

export default function Vendors() {
  const [region, setRegion] = useState("All");
  const [category, setCategory] = useState("All");
  const [tier, setTier] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = VENDORS.filter((v) => {
    if (region !== "All" && v.region !== region) return false;
    if (category !== "All" && v.category !== category) return false;
    if (tier !== "All" && v.tier !== tier) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <section className="border-b border-foreground/10">
        <div className="container py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Vendor Network</p>
          <h1 className="font-display text-2xl md:text-4xl font-800 uppercase tracking-tight">Explore Vendors</h1>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-foreground/10 sticky top-14 z-40 bg-background/95 backdrop-blur-sm">
        <div className="container py-3">
          <div className="flex flex-wrap items-center gap-5">
            <FilterGroup label="Region" options={REGIONS} value={region} onChange={setRegion} />
            <FilterGroup label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
            <FilterGroup label="Tier" options={TIERS} value={tier} onChange={setTier} />
            <div className="ml-auto flex items-center gap-1">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "text-foreground" : "text-muted-foreground"}`}>
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 transition-colors ${viewMode === "list" ? "text-foreground" : "text-muted-foreground"}`}>
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="container py-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
            {filtered.length} vendor{filtered.length !== 1 ? "s" : ""}
          </p>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
              {filtered.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-foreground/10">
              {filtered.map((vendor) => <VendorListItem key={vendor.id} vendor={vendor} />)}
            </div>
          )}
        </div>
      </section>

      {/* Gated CTA */}
      <section className="border-t border-foreground/10 bg-muted/50">
        <div className="container py-12 text-center">
          <Lock className="h-5 w-5 mx-auto mb-3 text-muted-foreground" />
          <h2 className="font-display text-xl font-800 uppercase tracking-tight mb-1">Full intelligence is gated</h2>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-5 max-w-sm mx-auto">
            Sign up to unlock MOQ bands, lead times, capabilities, and messaging.
          </p>
          <Link to="/join">
            <Button variant="editorial" size="lg">
              Unlock vendor data <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }: {
  label: string; options: readonly string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}:</span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`font-mono text-[10px] px-2.5 py-1 uppercase tracking-wider transition-all duration-150 ${
              value === opt
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="bg-background p-5 group hover:bg-muted/40 transition-colors duration-200">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-body text-sm font-600">{vendor.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{vendor.region}</span>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{vendor.category}</span>
          </div>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground">{vendor.tier}</span>
      </div>
      <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">{vendor.summary}</p>
      
      {/* Gated fields */}
      <div className="space-y-1">
        <GatedField label="MOQ Range" />
        <GatedField label="Lead Time" />
        <GatedField label="Capabilities" />
        <div className="flex items-center justify-between py-1 border-t border-dashed border-foreground/8">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Message</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/40">
            <MessageSquare className="h-2.5 w-2.5" /> Sign up
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider flex items-center gap-1">
          <Bookmark className="h-3 w-3" /> Save
        </button>
        <button className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider flex items-center gap-1">
          <GitCompare className="h-3 w-3" /> Compare
        </button>
        <span className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider flex items-center gap-1 ml-auto cursor-pointer">
          Profile <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

function VendorListItem({ vendor }: { vendor: Vendor }) {
  return (
    <div className="py-4 flex flex-col md:flex-row md:items-center gap-3 group hover:bg-muted/30 -mx-4 px-4 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="min-w-0">
          <h3 className="font-body text-sm font-600 truncate">{vendor.name}</h3>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{vendor.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground">{vendor.tier}</span>
        <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{vendor.region}</span>
        <span className="font-mono text-[10px] text-muted-foreground/40 flex items-center gap-1">
          <Lock className="h-3 w-3" /> Gated
        </span>
      </div>
    </div>
  );
}

function GatedField({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-t border-dashed border-foreground/8">
      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/40">
        <Lock className="h-2.5 w-2.5" /> Sign up to view
      </span>
    </div>
  );
}
