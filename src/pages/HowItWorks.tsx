import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    title: "Discover Manufacturers",
    description: "Browse our vetted network of manufacturers across the US, Portugal, and China. Filter by category, quality tier, MOQ, and lead time to find the right fit for your label.",
    detail: "Every manufacturer on Threadline has been verified for quality, reliability, and communication standards.",
  },
  {
    number: "02",
    title: "Submit a Production Brief",
    description: "Tell us what you need — category, quantity, quality tier, timeline, and how you balance quality vs. cost. Our system uses this to match you intelligently.",
    detail: "Briefs take under 2 minutes. The more specific you are, the better your matches.",
  },
  {
    number: "03",
    title: "Get Matched Automatically",
    description: "Based on your brief, we match you with manufacturers that fit your production needs. You'll receive matched vendor profiles with relevant capabilities and pricing indicators.",
    detail: "No cold outreach. Vendors who match your criteria are notified and can respond directly.",
  },
  {
    number: "04",
    title: "Request & Review Samples",
    description: "Once you've selected vendors, request samples to evaluate quality firsthand. Track sample status and timelines in your Workbench.",
    detail: "We recommend sampling with 2–3 vendors before committing to bulk production.",
  },
  {
    number: "05",
    title: "Move to Production",
    description: "Approve samples and move to bulk production. Your Workbench tracks every stage — from pre-production through manufacturing, QA, and shipping.",
    detail: "Stay informed at every step without chasing updates over email.",
  },
  {
    number: "06",
    title: "Receive & Ship Product",
    description: "Quality-checked product is shipped to your specified destination. Review your manufacturer experience to help future labels make better decisions.",
    detail: "Your production history stays in your Workbench for easy reorders and seasonal planning.",
  },
];

export default function HowItWorks() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-foreground/10">
        <div className="container py-16 md:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Platform Guide</p>
          <h1 className="font-display text-3xl md:text-5xl font-800 uppercase tracking-tight mb-4">
            How It Works
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-lg">
            From discovering the right manufacturer to receiving finished product — here's every step of the process.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section>
        {STEPS.map((step, i) => (
          <div key={step.number} className="border-b border-foreground/10">
            <div className="container py-10 md:py-14">
              <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-start">
                <div className="md:col-span-1">
                  <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-widest">{step.number}</span>
                </div>
                <div className="md:col-span-4">
                  <h2 className="font-display text-xl md:text-2xl font-800 uppercase tracking-tight">{step.title}</h2>
                </div>
                <div className="md:col-span-5">
                  <p className="font-body text-sm text-foreground/80 leading-relaxed mb-3">{step.description}</p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider leading-relaxed">{step.detail}</p>
                </div>
                <div className="md:col-span-2">
                  {/* Image placeholder */}
                  {(i === 0 || i === 3) && (
                    <div className="w-full aspect-square bg-muted border border-foreground/5 flex items-center justify-center">
                      <span className="font-mono text-[9px] text-muted-foreground/30 uppercase tracking-widest">Visual</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="container py-14">
          <h2 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight mb-2">Start now.</h2>
          <p className="font-mono text-[10px] text-background/40 uppercase tracking-wider mb-6">
            Submit your first brief in under 2 minutes.
          </p>
          <div className="flex gap-3">
            <Link to="/brief">
              <Button variant="signal" size="lg">
                Build Brief <ArrowUpRight className="ml-1 h-4 w-4" />
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
