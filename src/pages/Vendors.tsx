import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowUpRight, ArrowRight, Grid, List, Bookmark, BookmarkCheck, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VENDORS, useVendorActions, type Vendor } from "@/lib/vendors";

const REGIONS = ["All", "US", "PT", "CN", "IN"] as const;
const CATEGORIES = ["All", "Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim", "Private Label", "Outerwear", "Activewear", "Swimwear", "Leather Goods", "Tailoring", "Accessories"] as const;
const TIERS = ["All", "Premium", "Luxury"] as const;

export default function Vendors() {
  const [region, setRegion] = useState("All");
  const [category, setCategory] = useState("All");
  const [tier, setTier] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { savedIds, compareIds } = useVendorActions();

  const filtered = VENDORS.filter((v) => {
    if (region !== "All" && v.region !== region) return false;
    if (category !== "All" && v.category !== category) return false;
    if (tier !== "All" && v.tier !== tier) return false;
    return true;
  });

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="container py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Manufacturer Network</p>
          <h1 className="font-display text-2xl md:text-4xl font-800 uppercase tracking-tight">Browse Manufacturers</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Find the right factory for your project. Click "Start Project" on any manufacturer to begin.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-foreground/10 sticky top-14 z-40 bg-background/95 backdrop-blur-sm">
        <div className="container py-3">
          <div className="flex flex-wrap items-center gap-5">
            <FilterGroup label="Region" options={REGIONS} value={region} onChange={setRegion} />
            <FilterGroup label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
            <FilterGroup label="Tier" options={TIERS} value={tier} onChange={setTier} />
            <div className="ml-auto flex items-center gap-3">
              {savedIds.length > 0 && (
                <Link to="/saved" className="font-mono text-[10px] text-signal uppercase tracking-wider flex items-center gap-1">
                  <Bookmark className="h-3 w-3" /> {savedIds.length} saved
                </Link>
              )}
              {compareIds.length > 0 && (
                <Link to="/compare" className="font-mono text-[10px] text-signal uppercase tracking-wider flex items-center gap-1">
                  <GitCompare className="h-3 w-3" /> Compare ({compareIds.length})
                </Link>
              )}
              <div className="flex items-center gap-1">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 transition-colors ${viewMode === "grid" ? "text-foreground" : "text-muted-foreground"}`}>
                  <Grid className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 transition-colors ${viewMode === "list" ? "text-foreground" : "text-muted-foreground"}`}>
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="container py-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
            {filtered.length} manufacturer{filtered.length !== 1 ? "s" : ""}
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
          <h2 className="font-display text-xl font-800 uppercase tracking-tight mb-1">Want the full picture?</h2>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-5 max-w-sm mx-auto">
            Sign up to see MOQ ranges, lead times, pricing details, and message manufacturers directly.
          </p>
          <Link to="/join">
            <Button variant="editorial" size="lg">
              Create free account <ArrowUpRight className="ml-1 h-4 w-4" />
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
  const { toggleSave, toggleCompare, isSaved, isComparing } = useVendorActions();
  const saved = isSaved(vendor.id);
  const comparing = isComparing(vendor.id);

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
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-foreground/5">
        <Link
          to={`/brief?vendor=${vendor.id}&vendorName=${encodeURIComponent(vendor.name)}`}
          className="font-mono text-[10px] text-signal hover:text-signal/80 transition-colors uppercase tracking-wider flex items-center gap-1"
        >
          Start Project <ArrowRight className="h-3 w-3" />
        </Link>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => toggleCompare(vendor.id)}
            className={`font-mono text-[10px] transition-colors uppercase tracking-wider flex items-center gap-1 ${
              comparing ? "text-signal" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitCompare className="h-3 w-3" /> {comparing ? "Comparing" : "Compare"}
          </button>
          <button
            onClick={() => toggleSave(vendor.id)}
            className={`font-mono text-[10px] transition-colors uppercase tracking-wider flex items-center gap-1 ${
              saved ? "text-signal" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {saved ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function VendorListItem({ vendor }: { vendor: Vendor }) {
  const { toggleSave, toggleCompare, isSaved, isComparing } = useVendorActions();

  return (
    <div className="py-4 flex flex-col md:flex-row md:items-center gap-3 group hover:bg-muted/30 -mx-4 px-4 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="min-w-0">
          <h3 className="font-body text-sm font-600 truncate">{vendor.name}</h3>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{vendor.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          to={`/brief?vendor=${vendor.id}&vendorName=${encodeURIComponent(vendor.name)}`}
          className="font-mono text-[10px] text-signal hover:text-signal/80 transition-colors uppercase tracking-wider flex items-center gap-1"
        >
          Start Project <ArrowRight className="h-3 w-3" />
        </Link>
        <button
          onClick={() => toggleCompare(vendor.id)}
          className={`font-mono text-[10px] transition-colors uppercase tracking-wider flex items-center gap-1 ${
            isComparing(vendor.id) ? "text-signal" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GitCompare className="h-3 w-3" />
        </button>
        <button
          onClick={() => toggleSave(vendor.id)}
          className={`font-mono text-[10px] transition-colors uppercase tracking-wider flex items-center gap-1 ${
            isSaved(vendor.id) ? "text-signal" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isSaved(vendor.id) ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
        </button>
        <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground">{vendor.tier}</span>
        <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{vendor.region}</span>
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
