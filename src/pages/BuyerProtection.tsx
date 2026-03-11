import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Scale, ArrowUpRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROTECTIONS = [
  {
    icon: Lock,
    title: "Payment Escrow",
    description: "When you pay an invoice on Threadline, your funds are held securely until tracking confirms delivery. The manufacturer doesn't get paid until the shipment shows as delivered — just like eBay or Grailed.",
    details: [
      "Funds held from the moment you pay",
      "Released automatically when tracking confirms delivery",
      "If something goes wrong, your money stays protected",
    ],
  },
  {
    icon: Package,
    title: "Quality Guarantee",
    description: "If your delivered products don't match the samples you approved, we step in. You can request a redo, partial refund, or full refund depending on the severity.",
    details: [
      "Products must match approved samples",
      "Covers defects, wrong materials, and incorrect specs",
      "Photo evidence reviewed by our team within 48 hours",
    ],
  },
  {
    icon: Scale,
    title: "Dispute Resolution",
    description: "If you and your manufacturer can't agree, Threadline mediates. We review the project history, messages, samples, and evidence to reach a fair resolution.",
    details: [
      "Dedicated case manager assigned within 24 hours",
      "Full project history available as evidence",
      "Binding resolution within 7 business days",
    ],
  },
];

const HOW_ESCROW_WORKS = [
  { step: "01", title: "You pay the invoice", desc: "Funds are held securely by Threadline — not sent to the manufacturer yet." },
  { step: "02", title: "Manufacturer fulfills the order", desc: "Production, quality checks, and shipping proceed as agreed. A tracking number is provided." },
  { step: "03", title: "Tracking confirms delivery", desc: "We monitor the tracking number automatically. When it shows delivered, funds are released." },
  { step: "04", title: "Quality dispute window", desc: "You have 48 hours after delivery to open a dispute if the product doesn't match approved samples." },
];


export default function BuyerProtection() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-foreground/10">
        <div className="container py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-6 w-6 text-signal" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">Buyer Protection Program</p>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-800 uppercase tracking-tight mb-4">
            Your money is safe
            <br />
            <span className="text-muted-foreground">until you're satisfied.</span>
          </h1>
           <p className="font-body text-sm text-muted-foreground max-w-2xl">
            Every transaction on Threadline is protected. We hold your payment in escrow until confirmed delivery, guarantee quality against approved samples, and mediate any disputes — so you can focus on building your brand, not worrying about risk.
          </p>
        </div>
      </section>

      {/* Three Pillars */}
      <section>
        {PROTECTIONS.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="border-b border-foreground/10">
              <div className="container py-10 md:py-14">
                <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
                  <div className="md:col-span-1 flex items-center gap-3 md:flex-col md:items-start">
                    <Icon className="h-5 w-5 text-signal" />
                  </div>
                  <div className="md:col-span-4">
                    <h2 className="font-display text-xl md:text-2xl font-800 uppercase tracking-tight">{p.title}</h2>
                  </div>
                  <div className="md:col-span-7">
                    <p className="font-body text-sm text-foreground/80 leading-relaxed mb-4">{p.description}</p>
                    <ul className="space-y-2">
                      {p.details.map((d, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-signal flex-shrink-0 mt-1.5" />
                          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider leading-relaxed">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* How Escrow Works */}
      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-2">How Escrow Works</h2>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mb-8">
            Your payment follows a simple, secure flow. You stay in control at every step.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-foreground/10">
            {HOW_ESCROW_WORKS.map((s) => (
              <div key={s.step} className="bg-background p-6">
                <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest block mb-2">{s.step}</span>
                <h3 className="font-body text-sm font-600 mb-1">{s.title}</h3>
                <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="container py-14">
          <h2 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight mb-2">Build with confidence.</h2>
          <p className="font-body text-sm text-background/60 mb-6">
            Start your project knowing every payment is protected and every manufacturer is vetted.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/brief">
              <Button variant="signal" size="lg">
                Start a Project <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="border-background/30 text-foreground hover:bg-background hover:text-foreground">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
