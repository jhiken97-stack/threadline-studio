import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const TICKER_ITEMS = [
  "CUT & SEW — PORTUGAL",
  "HEAVYWEIGHT JERSEY — CHINA",
  "DENIM — US",
  "KNITWEAR — PORTUGAL",
  "FLEECE — CHINA",
  "PRIVATE LABEL — US",
  "LUXURY KNITS — PORTUGAL",
  "STREETWEAR BLANKS — CHINA",
];

const FEATURED_VENDORS = [
  { id: 1, name: "Ateliê Nova", region: "PT", category: "Cut & Sew", tier: "Premium", moq: "Gated", image: "N" },
  { id: 2, name: "Shenzhen Textile Co.", region: "CN", category: "Heavyweight Jersey", tier: "Luxury", moq: "Gated", image: "S" },
  { id: 3, name: "Brooklyn Garment Dist.", region: "US", category: "Denim", tier: "Premium", moq: "Gated", image: "B" },
  { id: 4, name: "Porto Fleece Works", region: "PT", category: "Fleece", tier: "Premium", moq: "Gated", image: "P" },
  { id: 5, name: "Guangzhou Knit Mill", region: "CN", category: "Knitwear", tier: "Luxury", moq: "Gated", image: "G" },
  { id: 6, name: "LA Cut House", region: "US", category: "Private Label", tier: "Premium", moq: "Gated", image: "L" },
];

const CATEGORIES = ["Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim", "Private Label"];

const FEED_ITEMS = [
  { type: "update", text: "Portugal lead times trending 2 weeks shorter for Q2 orders", time: "2h ago" },
  { type: "insight", text: "New heavyweight jersey capacity opens in Guangzhou district", time: "5h ago" },
  { type: "alert", text: "US denim mills seeing increased MOQ requirements for 2026", time: "1d ago" },
  { type: "update", text: "3 new premium knitwear vendors verified in Porto region", time: "2d ago" },
  { type: "insight", text: "China fleece pricing stabilizing after raw material adjustments", time: "3d ago" },
];

const GEO_MODULES = [
  { code: "US", name: "United States", vendors: 47, highlight: "Denim, Private Label, Cut & Sew" },
  { code: "PT", name: "Portugal", vendors: 32, highlight: "Premium Knits, Fleece, Cut & Sew" },
  { code: "CN", name: "China", vendors: 61, highlight: "Heavyweight Jersey, Knitwear, Scale Production" },
];

export default function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-foreground/10">
        <div className="container py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Manufacturing Discovery Platform
              </p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-800 uppercase leading-[0.9] tracking-tight">
                Find the
                <br />
                <span className="text-signal">right factory.</span>
                <br />
                Ship product.
              </h1>
            </div>
            <div className="md:col-span-5 flex flex-col gap-4">
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">
                Vetted manufacturers across US, Portugal, and China.
                Built for independent labels serious about quality production.
              </p>
              <div className="flex gap-3">
                <Link to="/vendors">
                  <Button variant="editorial" size="lg">
                    Explore Vendors <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/brief">
                  <Button variant="outline" size="lg">
                    Build Brief
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section className="border-b border-foreground/10 bg-foreground text-background overflow-hidden py-3">
        <div className="animate-ticker flex whitespace-nowrap gap-12">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-70 flex-shrink-0">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* QUICK DISCOVERY FILTERS */}
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em]">Quick Discovery</h2>
            <Link to="/vendors" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/vendors?category=${encodeURIComponent(cat)}`}
                className="font-mono text-xs px-4 py-2 border border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-200 uppercase tracking-wider"
              >
                {cat}
              </Link>
            ))}
            {["US", "PT", "CN"].map((r) => (
              <Link
                key={r}
                to={`/vendors?region=${r}`}
                className="font-mono text-xs px-4 py-2 bg-foreground text-background hover:bg-signal transition-all duration-200 uppercase tracking-wider"
              >
                {r}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VENDOR DROPS */}
      <section className="border-b border-foreground/10">
        <div className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight">Featured Drops</h2>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">Curated vendor selections — updated weekly</p>
            </div>
            <Link to="/vendors">
              <Button variant="outline" size="sm">
                See all vendors
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-foreground/10">
            {FEATURED_VENDORS.map((vendor) => (
              <Link
                key={vendor.id}
                to="/vendors"
                className="group bg-background p-6 hover:bg-muted transition-colors duration-200"
              >
                {/* Vendor initial block */}
                <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center mb-4 border border-foreground/5 group-hover:border-foreground/20 transition-colors">
                  <span className="font-display text-4xl md:text-5xl font-800 text-foreground/10 group-hover:text-foreground/30 transition-colors">
                    {vendor.image}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-body text-sm font-600 leading-tight">{vendor.name}</h3>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      {vendor.category}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase tracking-wider flex-shrink-0">
                    {vendor.region}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground">
                    {vendor.tier}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider">
                    MOQ: {vendor.moq}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GEOGRAPHY MODULES */}
      <section className="border-b border-foreground/10">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-8">Active Geographies</h2>
          <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
            {GEO_MODULES.map((geo) => (
              <div key={geo.code} className="bg-background p-8 group hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer">
                <span className="font-display text-5xl md:text-6xl font-800 leading-none block mb-4 group-hover:text-signal transition-colors">
                  {geo.code}
                </span>
                <h3 className="font-body text-sm font-600 mb-1">{geo.name}</h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-background/60 transition-colors mb-3">
                  {geo.vendors} verified vendors
                </p>
                <p className="font-mono text-[10px] text-muted-foreground group-hover:text-background/50 transition-colors leading-relaxed">
                  {geo.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE FEED */}
      <section className="border-b border-foreground/10">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-6">Sourcing Intel</h2>
          <div className="flex flex-col divide-y divide-foreground/10">
            {FEED_ITEMS.map((item, i) => (
              <div key={i} className="py-4 flex items-start gap-4 group hover:bg-muted/50 -mx-4 px-4 transition-colors">
                <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 flex-shrink-0 mt-0.5 ${
                  item.type === "alert" ? "bg-signal text-signal-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {item.type}
                </span>
                <p className="font-body text-sm leading-snug flex-1">{item.text}</p>
                <span className="font-mono text-[10px] text-muted-foreground/50 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="bg-foreground text-background">
        <div className="container py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-800 uppercase leading-[0.9] tracking-tight">
                Ready to source?
              </h2>
              <p className="font-mono text-xs text-background/50 uppercase tracking-wider mt-4">
                Access full vendor intelligence. Build production briefs. Ship.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <Link to="/vendors">
                <Button variant="signal" size="xl">
                  Explore Vendor Network <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/brief">
                <Button variant="outline" size="xl" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                  Build Production Brief
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
