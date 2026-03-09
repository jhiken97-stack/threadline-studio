import { Link } from "react-router-dom";
import { ArrowUpRight, MessageSquare, Users, FileText, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Users,
    title: "Dedicated Account Manager",
    description: "A real person who knows your project inside and out. They'll guide you from your first idea through to finished product.",
  },
  {
    icon: FileText,
    title: "Custom Manufacturing Plan",
    description: "We'll create a step-by-step production plan tailored to your budget, timeline, and quality goals — no guesswork.",
  },
  {
    icon: MessageSquare,
    title: "Communication Support",
    description: "Language barriers? Time zone issues? We handle manufacturer communication so nothing gets lost in translation.",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "We review samples on your behalf, flag issues early, and make sure what you receive matches what you ordered.",
  },
  {
    icon: Truck,
    title: "Logistics & Shipping",
    description: "From factory floor to your door — we coordinate shipping, customs, and delivery so you can focus on your brand.",
  },
  {
    icon: Headphones,
    title: "Ongoing Support",
    description: "Questions at 2am? Production delays? Reorder needs? Your concierge is always available to help.",
  },
];

export default function Concierge() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-foreground/10">
        <div className="container py-16 md:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">White-Glove Service</p>
          <h1 className="font-display text-3xl md:text-5xl font-800 uppercase tracking-tight mb-4">
            Threadline Concierge
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-lg mb-6">
            Not sure where to start? Our concierge service gives you a dedicated expert who will personally guide you through every step of manufacturing — from choosing a factory to receiving your finished product.
          </p>
          <p className="font-body text-sm text-foreground/80 max-w-lg">
            Think of it as having an experienced industry insider in your corner. Perfect for first-time creators who want hands-on support.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="border-b border-foreground/10">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-8">What's Included</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-background p-6">
                  <Icon className="h-5 w-5 text-signal mb-3" />
                  <h3 className="font-body text-sm font-600 mb-2">{feature.title}</h3>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-foreground/10 bg-muted/30">
        <div className="container py-12">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-8">How Concierge Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Tell us about your project", desc: "Fill out a quick form about what you want to make, your budget, and your timeline. No commitment required." },
              { step: "02", title: "Get matched with your concierge", desc: "We'll pair you with an expert who specializes in your product type. They'll reach out within 24 hours." },
              { step: "03", title: "Build and launch together", desc: "Your concierge handles the hard parts — manufacturer selection, sample coordination, production oversight, and shipping." },
            ].map((item) => (
              <div key={item.step} className="p-5 border border-foreground/10 bg-background">
                <span className="font-mono text-[9px] text-muted-foreground/40 block mb-3">{item.step}</span>
                <h3 className="font-body text-sm font-600 mb-2">{item.title}</h3>
                <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-b border-foreground/10">
        <div className="container py-12 max-w-2xl">
          <h2 className="font-display text-sm font-700 uppercase tracking-[0.15em] mb-6">Who Is This For?</h2>
          <ul className="space-y-4">
            {[
              "You're creating your first clothing line and don't know where to start",
              "You've tried reaching out to manufacturers but found the process overwhelming",
              "You want someone experienced to negotiate pricing and timelines on your behalf",
              "You need help with technical specs, tech packs, or material selection",
              "You're scaling an existing brand and want a smoother production process",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-signal flex-shrink-0 mt-1.5" />
                <span className="font-body text-sm text-foreground/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground text-background">
        <div className="container py-14">
          <h2 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight mb-2">
            Let's build your brand together.
          </h2>
          <p className="font-body text-sm text-background/60 mb-6 max-w-md">
            Get in touch to learn more about concierge pricing and availability. No pressure — just a conversation about your goals.
          </p>
          <div className="flex gap-3">
            <Link to="/join">
              <Button variant="signal" size="lg">
                Request Concierge <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="border-background/30 text-foreground hover:bg-background hover:text-foreground">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
