import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForManufacturers() {
  return (
    <div className="min-h-[60vh]">
      <section className="border-b border-foreground/10">
        <div className="container py-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">For Suppliers</p>
          <h1 className="font-display text-3xl md:text-4xl font-800 uppercase tracking-tight">For Manufacturers</h1>
        </div>
      </section>

      <section>
        <div className="container max-w-2xl py-16">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-3">How vendors join Threadline</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Manufacturers are primarily added to the Threadline network through our direct outreach and vetting process. 
                We source and verify production partners to ensure quality, reliability, and fit for independent labels.
              </p>
            </div>

            <div className="divider-editorial" />

            <div>
              <h2 className="font-display text-lg font-700 uppercase tracking-tight mb-3">Request consideration</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
                If you're a manufacturer interested in being reviewed for inclusion, you can submit a brief overview of your capabilities. 
                Our team evaluates submissions on a rolling basis.
              </p>

              <div className="border border-foreground/10 p-6">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-4"
                >
                  <ManufacturerField label="Factory Name" placeholder="Your factory or company name" />
                  <ManufacturerField label="Location" placeholder="City, Country" />
                  <ManufacturerField label="Specialization" placeholder="e.g. Heavyweight jersey, cut-and-sew" />
                  <ManufacturerField label="Contact Email" placeholder="contact@factory.com" type="email" />
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Brief Overview</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your production capabilities, certifications, and capacity."
                      className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors resize-none"
                    />
                  </div>
                  <Button variant="outline" size="lg" className="w-full">
                    Submit for Review <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            <p className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-wider text-center">
              Submission does not guarantee inclusion · All vendors are independently vetted
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ManufacturerField({ label, placeholder, type = "text" }: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );
}
