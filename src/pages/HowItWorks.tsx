import { Link } from "react-router-dom";
import { ArrowUpRight, Search, FileText, Users, Package, Factory, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Browse Manufacturers",
    description: "Search our network of vetted factories in the US, Portugal, and China. Filter by what you're making, your budget, and how many units you need.",
    detail: "Every manufacturer on Threadline has been checked for quality, reliability, and clear communication.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Tell Us What You Want to Make",
    description: "Fill out a simple project brief — what you're making, how many, and what matters most to you (quality, price, speed). It takes about 2 minutes.",
    detail: "You can submit to a specific manufacturer or let us match you automatically.",
  },
  {
    number: "03",
    icon: Users,
    title: "Get Matched with the Right Factory",
    description: "Based on your project details, we connect you with manufacturers who are the best fit. They'll review your brief and respond directly through the platform.",
    detail: "No cold emails or awkward introductions — manufacturers come to you.",
  },
  {
    number: "04",
    icon: Package,
    title: "Review Samples Before You Commit",
    description: "Before you order in bulk, your manufacturer will make sample pieces for you to check. You approve them, request changes, or try a different factory.",
    detail: "We recommend getting samples from 2–3 manufacturers to compare quality.",
  },
  {
    number: "05",
    icon: Factory,
    title: "Production & Communication",
    description: "Once you approve samples, bulk production begins. Your Workbench keeps you updated at every stage — no chasing emails or wondering what's happening.",
    detail: "Message your manufacturer directly through Threadline anytime you have questions.",
  },
  {
    number: "06",
    icon: Truck,
    title: "Receive Your Finished Product",
    description: "Your products go through a quality check and ship to you. You're ready to launch your collection, open your store, or start selling.",
    detail: "All your project history stays saved so you can easily reorder for your next season.",
  },
];

export default function HowItWorks() {
  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="container py-16 md:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Step-by-Step Guide</p>
          <h1 className="font-display text-3xl md:text-5xl font-800 uppercase tracking-tight mb-4">
            How It Works
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-lg">
            Making your own clothing line sounds complicated — but it doesn't have to be. Here's exactly how Threadline takes you from idea to finished product.
          </p>
        </div>
      </section>

      <section>
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="border-b border-foreground/10">
              <div className="container py-10 md:py-14">
                <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
                  <div className="md:col-span-1 flex items-center gap-3 md:flex-col md:items-start">
                    <Icon className="h-5 w-5 text-signal" />
                    <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">{step.number}</span>
                  </div>
                  <div className="md:col-span-4">
                    <h2 className="font-display text-xl md:text-2xl font-800 uppercase tracking-tight">{step.title}</h2>
                  </div>
                  <div className="md:col-span-7">
                    <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">{step.description}</p>
                    <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* BUYER PROTECTION */}
      <section className="border-b border-foreground/10 bg-signal/5">
        <div className="container py-12">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-signal flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-2">Buyer Protection on Every Project</h2>
              <p className="font-body text-sm text-muted-foreground max-w-lg mb-4">
                Every payment you make on Threadline is held in escrow until you approve. If the delivered product doesn't match your approved samples, we guarantee a resolution — including refunds and redos.
              </p>
              <div className="flex flex-wrap gap-6 mb-4">
                {["Payment held until you approve", "Quality guaranteed vs. samples", "Dispute resolution in 7 days"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
                    <span className="w-1.5 h-1.5 bg-signal" /> {item}
                  </span>
                ))}
              </div>
              <Link to="/buyer-protection" className="font-mono text-[10px] text-signal uppercase tracking-wider hover:text-signal/80 transition-colors flex items-center gap-1">
                Full protection details <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TRANSPARENCY */}
      <section className="border-b border-foreground/10">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-2">Simple, Transparent Pricing</h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg mb-8">
            No subscriptions. No hidden fees. Threadline only makes money when your project moves forward.
          </p>
          <div className="grid sm:grid-cols-3 gap-px bg-foreground/10 max-w-3xl">
            <div className="bg-background p-6">
              <span className="font-display text-3xl font-800 text-signal block mb-1">1%</span>
              <h3 className="font-body text-sm font-600 mb-1">Brand Fee</h3>
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                Added to your invoice total at checkout. On a $5,000 order, that's $50.
              </p>
            </div>
            <div className="bg-background p-6">
              <span className="font-display text-3xl font-800 text-signal block mb-1">1%</span>
              <h3 className="font-body text-sm font-600 mb-1">Vendor Fee</h3>
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                Deducted from the vendor's payout. Manufacturers keep 99% of every payment.
              </p>
            </div>
            <div className="bg-background p-6">
              <span className="font-display text-3xl font-800 text-foreground block mb-1">2%</span>
              <h3 className="font-body text-sm font-600 mb-1">Total Platform Fee</h3>
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                That's it. No markups on manufacturing costs, no monthly charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-foreground text-background">
        <div className="container py-14">
          <h2 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight mb-2">Ready to get started?</h2>
          <p className="font-body text-sm text-background/60 mb-6">
            It's free to browse manufacturers and submit your first project.
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
