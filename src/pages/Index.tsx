import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURED_MANUFACTURERS = [
  { id: 1, name: "Ateliê Nova", region: "PT", category: "Cut & Sew", tier: "Premium" },
  { id: 2, name: "Shenzhen Textile Co.", region: "CN", category: "Heavyweight Jersey", tier: "Luxury" },
  { id: 3, name: "Brooklyn Garment Dist.", region: "US", category: "Denim", tier: "Premium" },
];

const CATEGORIES = ["Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim", "Private Label"];

const GEO_MODULES = [
  { code: "US", name: "United States", vendors: 47, highlight: "Denim, Private Label, Cut & Sew" },
  { code: "PT", name: "Portugal", vendors: 32, highlight: "Premium Knits, Fleece, Cut & Sew" },
  { code: "CN", name: "China", vendors: 61, highlight: "Heavyweight Jersey, Knitwear, Scale" },
];

export default function Index() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-foreground/10">
        <div className="container py-20 md:py-28">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Manufacturing Discovery Platform
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-800 uppercase leading-[0.9] tracking-tight mb-8">
            Find the right factory.
            <br />
            <span className="text-signal">Ship product.</span>
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-md mb-8">
            Vetted manufacturers across US, Portugal, and China.
            Built for independent labels serious about quality production.
          </p>
          <div className="flex gap-3">
            <Link to="/vendors">
              <Button variant="editorial" size="lg">
                Explore Vendors <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK FILTERS */}
      <section className="border-b border-foreground/10">
        <div className="container py-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/vendors?category=${encodeURIComponent(cat)}`}
                className="font-mono text-[10px] px-3 py-1.5 border border-foreground/15 hover:bg-foreground hover:text-background transition-all uppercase tracking-wider"
              >
                {cat}
              </Link>
            ))}
            {["US", "PT", "CN"].map((r) => (
              <Link
                key={r}
                to={`/vendors?region=${r}`}
                className="font-mono text-[10px] px-3 py-1.5 bg-foreground text-background hover:bg-signal transition-all uppercase tracking-wider"
              >
                {r}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MANUFACTURERS */}
      <section className="border-b border-foreground/10">
        <div className="container py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-lg font-800 uppercase tracking-tight">Featured Manufacturers</h2>
            <Link to="/vendors" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
            {FEATURED_MANUFACTURERS.map((m) => (
              <Link
                key={m.id}
                to="/vendors"
                className="group bg-background p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="w-full aspect-[3/2] bg-muted flex items-center justify-center mb-4 border border-foreground/5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
                    Image placeholder
                  </span>
                </div>
                <h3 className="font-body text-sm font-600">{m.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{m.region}</span>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{m.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GEOGRAPHIES */}
      <section className="border-b border-foreground/10">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-6">Regions</h2>
          <div className="grid md:grid-cols-3 gap-px bg-foreground/10">
            {GEO_MODULES.map((geo) => (
              <div key={geo.code} className="bg-background p-6 group hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer">
                <span className="font-display text-4xl font-800 leading-none block mb-3 group-hover:text-signal transition-colors">
                  {geo.code}
                </span>
                <h3 className="font-body text-sm font-600">{geo.name}</h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground group-hover:text-background/50 transition-colors mt-1">
                  {geo.vendors} vendors · {geo.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="container py-16">
          <h2 className="font-display text-2xl md:text-4xl font-800 uppercase tracking-tight mb-3">
            Ready to source?
          </h2>
          <p className="font-mono text-[10px] text-background/40 uppercase tracking-wider mb-6">
            Submit a brief. Get matched with vetted manufacturers automatically.
          </p>
          <div className="flex gap-3">
            <Link to="/brief">
              <Button variant="signal" size="lg">
                Build Production Brief <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vendors">
              <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                Browse Vendors
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
