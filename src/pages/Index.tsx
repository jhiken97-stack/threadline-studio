import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Lock, Bookmark, BookmarkCheck, GitCompare, Factory, FileText, Package, Truck, Search, MessageSquare, CreditCard, ClipboardList, Bell, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVendorActions } from "@/lib/vendors";
import fashionHoodie from "@/assets/fashion-hoodie.jpg";
import fashionDenim from "@/assets/fashion-denim.jpg";
import fashionFleece from "@/assets/fashion-fleece.jpg";
import fashionTee from "@/assets/fashion-tee.jpg";
import runway1 from "@/assets/runway-3.mp4";
import runway2 from "@/assets/runway-4.mp4";
import runway3 from "@/assets/runway-5.mp4";

const RUNWAY_CLIPS = [runway1, runway2, runway3];

const CATEGORIES = ["Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim", "Private Label"] as const;
const MOQ_RANGES = [
  { label: "Under 100 units", value: "0-100" },
  { label: "100 – 300 units", value: "100-300" },
  { label: "300 – 500 units", value: "300-500" },
  { label: "500+ units", value: "500+" },
] as const;
const REGIONS_OPTIONS = [
  { label: "United States", value: "US" },
  { label: "Portugal", value: "PT" },
  { label: "China", value: "CN" },
  { label: "India", value: "IN" },
] as const;

const FEATURED_MANUFACTURERS = [
  { id: 1, name: "Ateliê Nova", region: "PT", categories: ["Cut & Sew"], tier: "Premium", moqRange: "100-300", image: fashionHoodie },
  { id: 2, name: "Shenzhen Textile Co.", region: "CN", categories: ["Heavyweight Jersey"], tier: "Luxury", moqRange: "300-500", image: fashionTee },
  { id: 3, name: "Brooklyn Garment Dist.", region: "US", categories: ["Denim"], tier: "Premium", moqRange: "100-300", image: fashionDenim },
  { id: 4, name: "Porto Fleece Works", region: "PT", categories: ["Fleece"], tier: "Premium", moqRange: "0-100", image: fashionFleece },
  { id: 5, name: "Guangzhou Knit Mill", region: "CN", categories: ["Knitwear"], tier: "Luxury", moqRange: "500+", image: fashionHoodie },
  { id: 6, name: "LA Cut House", region: "US", categories: ["Private Label"], tier: "Premium", moqRange: "0-100", image: fashionTee },
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
  { code: "IN", name: "India", count: 10, specialties: "Cotton · Knitwear · Tailoring · Embroidery" },
];

export default function Index() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMoq, setSelectedMoq] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const filtered = useMemo(() => {
    return FEATURED_MANUFACTURERS.filter((m) => {
      if (selectedCategory && !m.categories.includes(selectedCategory)) return false;
      if (selectedRegion && m.region !== selectedRegion) return false;
      if (selectedMoq && m.moqRange !== selectedMoq) return false;
      return true;
    });
  }, [selectedCategory, selectedRegion, selectedMoq]);

  const hasFilters = selectedCategory || selectedMoq || selectedRegion;

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedMoq("");
    setSelectedRegion("");
  };

  const [activeClip, setActiveClip] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  const advanceClip = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setActiveClip((prev) => (prev + 1) % RUNWAY_CLIPS.length);
      setFadeIn(true);
    }, 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(advanceClip, 4000);
    return () => clearInterval(interval);
  }, [advanceClip]);

  return (
    <div>
      {/* HERO — fast-paced runway montage */}
      <section className="relative">
        <div className="w-full h-[50vh] md:h-[60vh] overflow-hidden bg-foreground">
          {RUNWAY_CLIPS.map((clip, i) => (
            <video
              key={i}
              autoPlay
              loop
              muted
              playsInline
              src={clip}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                i === activeClip && fadeIn ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
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

            {/* Selector Module */}
            <div className="max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 bg-background border-foreground/15 font-mono text-xs uppercase tracking-wider">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="font-mono text-xs uppercase tracking-wider">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedMoq} onValueChange={setSelectedMoq}>
                  <SelectTrigger className="h-12 bg-background border-foreground/15 font-mono text-xs uppercase tracking-wider">
                    <SelectValue placeholder="MOQ Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOQ_RANGES.map((moq) => (
                      <SelectItem key={moq.value} value={moq.value} className="font-mono text-xs uppercase tracking-wider">
                        {moq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-12 bg-background border-foreground/15 font-mono text-xs uppercase tracking-wider">
                    <SelectValue placeholder="Factory Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS_OPTIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value} className="font-mono text-xs uppercase tracking-wider">
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="signal"
                  size="lg"
                  className="h-12 px-6"
                  onClick={() => {
                    const params = new URLSearchParams();
                    if (selectedCategory) params.set("category", selectedCategory);
                    if (selectedMoq) params.set("moq", selectedMoq);
                    if (selectedRegion) params.set("region", selectedRegion);
                    navigate(`/vendors?${params.toString()}`);
                  }}
                >
                  Find Manufacturers <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="font-mono text-[10px] text-background/50 hover:text-background transition-colors uppercase tracking-wider mt-3"
                >
                  Clear selections
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
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

      {/* FEATURED MANUFACTURERS */}
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-sm font-800 uppercase tracking-tight">
              Featured Manufacturers
              <span className="font-mono text-[10px] font-400 text-muted-foreground ml-3">{filtered.length} results</span>
            </h2>
            <div className="flex items-center gap-4">
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  Clear filters
                </button>
              )}
              <Link to="/vendors" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
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
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em]">Manufacturer Regions</h2>
            <Link to="/sourcing-guide" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              Sourcing guide <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-5">
            Where our manufacturers are based — your brand can be located anywhere
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10">
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

      {/* EVERYTHING IN ONE PLACE */}
      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-2">Everything in One Place</h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg mb-8">
            No juggling spreadsheets, email chains, and separate invoicing tools. Threadline handles your entire production workflow.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10">
            {[
              { icon: ShieldCheck, title: "Buyer Protection", desc: "Every payment is held in escrow until you approve. Quality guaranteed against approved samples.", link: "/buyer-protection" },
              { icon: MessageSquare, title: "Communication", desc: "Message manufacturers directly — all conversations saved in one thread" },
              { icon: CreditCard, title: "Payments & Invoices", desc: "Pay securely through the platform with transparent invoicing — just a 2.5% fee on each side" },
              { icon: ClipboardList, title: "Order Updates", desc: "Track production milestones from sampling to delivery in real time" },
            ].map((item) => {
              const Icon = item.icon;
              const content = (
                <div key={item.title} className={`bg-background p-6 ${item.link ? "hover:bg-muted/40 transition-colors" : ""}`}>
                  <Icon className="h-5 w-5 text-signal mb-3" />
                  <h3 className="font-body text-sm font-600 mb-1">{item.title}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
              return item.link ? <Link key={item.title} to={item.link}>{content}</Link> : content;
            })}
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
              <Button variant="outline" size="lg" className="border-background/30 text-foreground hover:bg-background hover:text-foreground">
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
