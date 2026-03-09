import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Globe, Leaf, Zap, DollarSign, Award, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const REGIONS = [
  {
    code: "US",
    name: "United States",
    strengths: [
      "Fastest turnaround for US-based brands — no customs, shorter shipping",
      "Strong in denim, private label, and streetwear-oriented cut & sew",
      "Ideal for small batches and rapid prototyping",
      "\"Made in USA\" branding value for domestic markets",
    ],
    considerations: [
      "Higher per-unit cost compared to overseas production",
      "More limited scale — most US factories specialize in small-to-mid runs",
    ],
    bestFor: "Brands that need speed, small runs, or \"Made in USA\" positioning.",
    specialties: ["Denim", "Private Label", "Cut & Sew", "Streetwear"],
  },
  {
    code: "PT",
    name: "Portugal",
    strengths: [
      "Known as Europe's premium manufacturing hub — luxury without the luxury price",
      "Exceptional knitwear, fleece, and cut & sew quality",
      "Strong sustainability credentials (GOTS, OEKO-TEX common)",
      "Culturally aligned with Western brand standards and communication",
    ],
    considerations: [
      "Lead times can be 6–10 weeks for sampling + production",
      "MOQs tend to be moderate — not ideal for very large-scale runs",
    ],
    bestFor: "Brands focused on premium quality, sustainability, or European production.",
    specialties: ["Premium Knits", "Fleece", "Cut & Sew", "Luxury Finishing"],
  },
  {
    code: "CN",
    name: "China",
    strengths: [
      "Unmatched scale — can handle very large production runs efficiently",
      "Heavyweight jersey and knitwear expertise at competitive pricing",
      "Advanced machinery and technical fabric capabilities",
      "Mature supply chain with fabric sourcing, trims, and packaging in one ecosystem",
    ],
    considerations: [
      "Longer shipping times to North America and Europe",
      "Communication may require more detailed specs upfront",
      "Navigating quality can be inconsistent without vetting (we handle this for you)",
    ],
    bestFor: "Brands scaling up, needing high volume, or working with technical fabrics.",
    specialties: ["Heavyweight Jersey", "Knitwear", "Scale Production", "Technical Fabrics"],
  },
  {
    code: "IN",
    name: "India",
    strengths: [
      "World-class cotton and organic cotton production — vertically integrated mills",
      "Exceptional hand-finishing, embroidery, and embellishment expertise",
      "Strong knitwear hub in Tirupur with massive certified capacity",
      "Very competitive pricing for premium-quality production",
      "Growing activewear and performance fabric capabilities",
    ],
    considerations: [
      "Lead times can be longer for luxury finishing and hand-work",
      "Best results come from clear, detailed tech packs",
    ],
    bestFor: "Brands working with cotton, knitwear, or needing artisanal details at scale.",
    specialties: ["Organic Cotton", "Knitwear", "Embroidery", "Tailoring", "Activewear"],
  },
];

const DECISION_FACTORS = [
  {
    icon: Package,
    title: "What are you making?",
    description: "Different regions excel at different product types. Denim? The US has heritage expertise. Knitwear? Portugal and India are world-class. Heavyweight jersey at scale? China.",
  },
  {
    icon: DollarSign,
    title: "What's your budget?",
    description: "Per-unit costs vary significantly. India and China offer the most competitive pricing. Portugal is mid-range with premium quality. The US is highest cost but fastest to market.",
  },
  {
    icon: Clock,
    title: "How fast do you need it?",
    description: "US factories can turn samples in 1–2 weeks. Overseas production typically needs 4–8 weeks for sampling, plus production time. Factor in shipping for overseas orders.",
  },
  {
    icon: Zap,
    title: "How many units?",
    description: "Small batches (under 200) are often easier domestically. Mid-range (200–1000) works well anywhere. Large runs (1000+) benefit from China or India's scale and pricing.",
  },
  {
    icon: Leaf,
    title: "Sustainability requirements?",
    description: "Portugal and India lead in certified organic and sustainable production. Many factories in Tirupur (India) and Northern Portugal hold GOTS and OEKO-TEX certifications.",
  },
  {
    icon: Award,
    title: "Brand positioning?",
    description: "\"Made in Portugal\" and \"Made in USA\" carry brand cachet in premium markets. \"Made in India\" is gaining recognition in sustainable fashion. Focus on quality, not just origin.",
  },
];

export default function SourcingGuide() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-foreground/10">
        <div className="container py-16 md:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Regional Sourcing Guide</p>
          <h1 className="font-display text-3xl md:text-5xl font-800 uppercase tracking-tight mb-4">
            Where Should You Manufacture?
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-xl">
            There's no single "best" region — it depends on what you're making, how many, and what matters most to your brand. This guide helps you think through the tradeoffs so you can make an informed choice.
          </p>
          <p className="font-mono text-[10px] text-signal uppercase tracking-wider mt-4">
            Every manufacturer on Threadline is vetted regardless of region.
          </p>
        </div>
      </section>

      {/* Decision factors */}
      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-2">How to Think About It</h2>
          <p className="font-body text-sm text-muted-foreground mb-8 max-w-lg">
            Before picking a region, consider these factors. Your answers will naturally point you toward the right fit — or you can skip this entirely and let us match you.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
            {DECISION_FACTORS.map((factor) => {
              const Icon = factor.icon;
              return (
                <div key={factor.title} className="bg-background p-6">
                  <Icon className="h-5 w-5 text-signal mb-3" />
                  <h3 className="font-body text-sm font-600 mb-2">{factor.title}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{factor.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Region deep-dives */}
      <section>
        {REGIONS.map((region) => (
          <div key={region.code} className="border-b border-foreground/10">
            <div className="container py-12 md:py-16">
              <div className="grid md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-4">
                  <span className="font-display text-5xl md:text-6xl font-800 leading-none block mb-2 text-foreground">
                    {region.code}
                  </span>
                  <h2 className="font-display text-xl font-800 uppercase tracking-tight mb-2">{region.name}</h2>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {region.specialties.map((s) => (
                      <span key={s} className="font-mono text-[9px] px-2 py-1 border border-foreground/15 uppercase tracking-wider text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/vendors?region=${region.code}`}
                    className="font-mono text-[10px] text-signal hover:text-signal/80 transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    Browse {region.name} manufacturers <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="md:col-span-8">
                  <div className="mb-6">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Strengths</h3>
                    <ul className="space-y-2">
                      {region.strengths.map((s, i) => (
                        <li key={i} className="font-body text-sm text-foreground/80 flex items-start gap-2">
                          <span className="text-signal mt-0.5">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Things to Consider</h3>
                    <ul className="space-y-2">
                      {region.considerations.map((c, i) => (
                        <li key={i} className="font-body text-sm text-foreground/60 flex items-start gap-2">
                          <span className="text-muted-foreground mt-0.5">•</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 border border-foreground/5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Best For</p>
                    <p className="font-body text-sm text-foreground/80">{region.bestFor}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Bottom note + CTA */}
      <section className="bg-foreground text-background">
        <div className="container py-14">
          <Globe className="h-6 w-6 text-signal mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight mb-3">
            Still not sure? That's fine.
          </h2>
          <p className="font-body text-sm text-background/60 max-w-lg mb-2">
            You don't need to pick a region upfront. Submit your project brief and tell us what you're making — we'll match you with the best manufacturers across all regions based on your needs, not geography.
          </p>
          <p className="font-mono text-[10px] text-background/40 uppercase tracking-wider mb-6">
            Great products get made everywhere. We help you find the right partner, wherever they are.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/brief">
              <Button variant="signal" size="lg">
                Start a Project — We'll Match You <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/vendors">
              <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                Browse All Manufacturers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
