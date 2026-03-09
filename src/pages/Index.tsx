import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Search, Lock, Bookmark, BookmarkCheck, GitCompare, Factory, FileText, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorActions } from "@/lib/vendors";
import fashionHoodie from "@/assets/fashion-hoodie.jpg";
import fashionDenim from "@/assets/fashion-denim.jpg";
import fashionFleece from "@/assets/fashion-fleece.jpg";
import fashionTee from "@/assets/fashion-tee.jpg";

const CATEGORIES = ["Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim", "Private Label"] as const;
const REGIONS = ["US", "PT", "CN"] as const;

const FEATURED_MANUFACTURERS = [
  { id: 1, name: "Ateliê Nova", region: "PT", categories: ["Cut & Sew"], tier: "Premium", image: fashionHoodie },
  { id: 2, name: "Shenzhen Textile Co.", region: "CN", categories: ["Heavyweight Jersey"], tier: "Luxury", image: fashionTee },
  { id: 3, name: "Brooklyn Garment Dist.", region: "US", categories: ["Denim"], tier: "Premium", image: fashionDenim },
  { id: 4, name: "Porto Fleece Works", region: "PT", categories: ["Fleece"], tier: "Premium", image: fashionFleece },
  { id: 5, name: "Guangzhou Knit Mill", region: "CN", categories: ["Knitwear"], tier: "Luxury", image: fashionHoodie },
  { id: 6, name: "LA Cut House", region: "US", categories: ["Private Label"], tier: "Premium", image: fashionTee },
];

const SEARCH_SUGGESTIONS = [
  "Heavyweight fleece, Portugal",
  "Cut & sew, MOQ < 300",
  "Denim specialist, USA",
  "Luxury knitwear, China",
];

const HOW_IT_WORKS_STEPS = [
  { icon: Search, title: "Browse manufacturers", desc: "Search vetted factories by category, country, and budget" },
  { icon: FileText, title: "Submit your project", desc: "Tell us what you want to make — we'll match you with the right factory" },
  { icon: Package, title: "Review samples", desc: "Approve physical samples before committing to a full production run" },
  { icon: Factory, title: "Production begins", desc: "Your manufacturer produces your order while we keep you updated" },
  { icon: Truck, title: "Receive your product", desc: "Quality-checked products shipped to you, ready to sell" },
];

const GEO_MODULES = [
  { code: "US", name: "United States", count: 10, specialties: "Denim · Private Label · Cut & Sew" },
  { code: "PT", name: "Portugal", count: 10, specialties: "Premium Knits · Fleece · Cut & Sew" },
  { code: "CN", name: "China", count: 10, specialties: "Heavyweight Jersey · Knitwear · Scale" },
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleRegion = (r: string) => {
    setActiveRegions((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  };

  const filtered = useMemo(() => {
    return FEATURED_MANUFACTURERS.filter((m) => {
      if (activeCategories.length > 0 && !m.categories.some((c) => activeCategories.includes(c))) return false;
      if (activeRegions.length > 0 && !activeRegions.includes(m.region)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.categories.some((c) => c.toLowerCase().includes(q)) ||
          m.region.toLowerCase().includes(q) ||
          m.tier.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategories, activeRegions, searchQuery]);

  return (
    <div>
      {/* HERO — full-width image with overlay */}
      <section className="relative">
        <div className="w-full h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={fashionHoodie} alt="Fashion production" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-background/60 mb-4">
              Your shortcut to manufacturing
            </p>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-800 uppercase leading-[0.9] tracking-tight mb-4 text-background">
              Bring your
              <br />
              clothing ideas
              <br />
              <span className="text-signal">to life.</span>
            </h1>
            <p className="font-body text-sm text-background/70 max-w-md mb-8">
              We connect new clothing brands with vetted manufacturers — and guide you through every step, from first sample to finished product.
            </p>

            {/* Search Module */}
            <div className="max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/vendors?q=${encodeURIComponent(searchQuery)}`)}
                  placeholder="Search by product, category, MOQ, or country…"
                  className="w-full h-12 pl-11 pr-4 bg-background border border-foreground/15 font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {SEARCH_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSearchQuery(s)}
                    className="font-mono text-[10px] px-2.5 py-1 border border-background/20 text-background/60 hover:text-background hover:border-background/40 transition-colors uppercase tracking-wider"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — synced with full page, with icons */}
      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-sm font-700 uppercase tracking-tight">How Threadline works</h2>
            <Link to="/how-it-works" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Full guide <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {HOW_IT_WORKS_STEPS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-4 border border-foreground/10 bg-background">
                  <Icon className="h-4 w-4 text-signal mb-2" />
                  <span className="font-mono text-[9px] text-muted-foreground/40 block mb-1">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-body text-sm font-600 mb-1">{item.title}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FILTER CHIPS */}
      <section className="border-b border-foreground/10">
        <div className="container py-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Filter:</span>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider transition-all ${
                    activeCategories.includes(cat)
                      ? "bg-foreground text-background"
                      : "border border-foreground/15 text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="w-px h-4 bg-foreground/10" />
            <div className="flex gap-1.5">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRegion(r)}
                  className={`font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider transition-all ${
                    activeRegions.includes(r)
                      ? "bg-signal text-signal-foreground"
                      : "bg-foreground text-background hover:bg-signal hover:text-signal-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {(activeCategories.length > 0 || activeRegions.length > 0) && (
              <button
                onClick={() => { setActiveCategories([]); setActiveRegions([]); }}
                className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED MANUFACTURERS */}
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-sm font-800 uppercase tracking-tight">
              Featured Manufacturers
              <span className="font-mono text-[10px] font-400 text-muted-foreground ml-3">{filtered.length} results</span>
            </h2>
            <Link to="/vendors" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
            {filtered.map((m) => (
              <ManufacturerCard key={m.id} manufacturer={m} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider text-center py-12">
              No manufacturers match current filters
            </p>
          )}
        </div>
      </section>

      {/* REGIONS */}
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-1">Manufacturer Regions</h2>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-5">
            Where our manufacturers are based — your brand can be located anywhere
          </p>
          <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
            {GEO_MODULES.map((geo) => (
              <Link key={geo.code} to={`/vendors?region=${geo.code}`} className="bg-background p-5 group hover:bg-foreground hover:text-background transition-all duration-300">
                <span className="font-display text-3xl font-800 leading-none block mb-2 group-hover:text-signal transition-colors">
                  {geo.code}
                </span>
                <h3 className="font-body text-sm font-600">{geo.name}</h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-background/50 transition-colors mt-1">
                  {geo.count} manufacturers · {geo.specialties}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="container py-12">
          <h2 className="font-display text-xl md:text-3xl font-800 uppercase tracking-tight mb-2">
            Ready to start your brand?
          </h2>
          <p className="font-mono text-[10px] text-background/40 uppercase tracking-wider mb-5">
            Tell us what you want to make — we'll help you find the right manufacturer and guide you through the process.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/brief">
              <Button variant="signal" size="lg">
                Start Your First Project <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/concierge">
              <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                Get 1-on-1 Help
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ManufacturerCard({ manufacturer: m }: { manufacturer: typeof FEATURED_MANUFACTURERS[0] }) {
  const { toggleSave, toggleCompare, isSaved, isComparing } = useVendorActions();
  const saved = isSaved(m.id);
  const comparing = isComparing(m.id);

  return (
    <div className="bg-background p-5 group hover:bg-muted/40 transition-colors duration-200">
      <div className="w-full aspect-[3/2] bg-muted mb-3 border border-foreground/5 overflow-hidden">
        <img src={m.image} alt={`${m.name} production`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-body text-sm font-600">{m.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{m.region}</span>
            {m.categories.map((c) => (
              <span key={c} className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{c}</span>
            ))}
          </div>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground">{m.tier}</span>
      </div>

      {/* Gated preview fields */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center justify-between py-1 border-t border-dashed border-foreground/8">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">MOQ Range</span>
          <span className="font-mono text-[10px] text-muted-foreground/40 flex items-center gap-1">
            <Lock className="h-2.5 w-2.5" /> Sign up
          </span>
        </div>
        <div className="flex items-center justify-between py-1 border-t border-dashed border-foreground/8">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Lead Time</span>
          <span className="font-mono text-[10px] text-muted-foreground/40 flex items-center gap-1">
            <Lock className="h-2.5 w-2.5" /> Sign up
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => toggleSave(m.id)}
          className={`font-mono text-[10px] transition-colors uppercase tracking-wider flex items-center gap-1 ${
            saved ? "text-signal" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {saved ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
          {saved ? "Saved" : "Save"}
        </button>
        <button
          onClick={() => toggleCompare(m.id)}
          className={`font-mono text-[10px] transition-colors uppercase tracking-wider flex items-center gap-1 ${
            comparing ? "text-signal" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <GitCompare className="h-3 w-3" /> {comparing ? "Comparing" : "Compare"}
        </button>
        <Link to={`/brief?vendor=${m.id}&vendorName=${encodeURIComponent(m.name)}`} className="font-mono text-[10px] text-signal hover:text-signal/80 transition-colors uppercase tracking-wider flex items-center gap-1 ml-auto">
          Start Project <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
