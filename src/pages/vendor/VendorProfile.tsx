import { useState } from "react";
import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorAuth } from "@/lib/vendor-auth";
import { QualityScale } from "@/components/QualityScale";
import { useToast } from "@/hooks/use-toast";

const ALL_CATEGORIES = [
  "Cut & Sew", "Heavyweight Jersey", "Fleece", "Knitwear", "Denim",
  "Private Label", "Outerwear", "Activewear", "Swimwear", "Leather Goods",
  "Tailoring", "Accessories", "Shirting",
];

const ALL_CERTS = ["GOTS", "OEKO-TEX", "BSCI", "WRAP", "ISO 9001", "SA8000", "GRS", "BCI"];

export default function VendorProfile() {
  const { vendorProfile, updateProfile } = useVendorAuth();
  const { toast } = useToast();
  const [form, setForm] = useState(vendorProfile);

  const handleSave = () => {
    updateProfile(form);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  const toggleCert = (cert: string) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter((c) => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Settings</p>
          <h1 className="font-display text-2xl font-800 uppercase tracking-tight">Factory Profile</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">
            Manage your capabilities, pricing position, and production details.
          </p>
        </div>
      </section>

      <section className="p-6 md:p-8 max-w-2xl">
        <div className="space-y-8">
          {/* Basic info */}
          <div className="space-y-4">
            <h2 className="font-display text-sm font-700 uppercase tracking-tight">Details</h2>
            <Field label="Factory Name" value={form.factoryName} onChange={(v) => setForm({ ...form, factoryName: v })} />
            <Field label="Contact Name" value={form.contactName} onChange={(v) => setForm({ ...form, contactName: v })} />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Region</label>
              <div className="flex gap-1">
                {["US", "PT", "CN", "IN", "TR", "JP"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setForm({ ...form, region: r })}
                    className={`font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider transition-colors ${
                      form.region === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground border border-foreground/10"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divider-editorial" />

          {/* Categories */}
          <div>
            <h2 className="font-display text-sm font-700 uppercase tracking-tight mb-3">Specializations</h2>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider transition-colors ${
                    form.categories.includes(cat)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground border border-foreground/10"
                  }`}
                >
                  {form.categories.includes(cat) && <span className="mr-1">✓</span>}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divider-editorial" />

          {/* Quality positioning */}
          <div>
            <h2 className="font-display text-sm font-700 uppercase tracking-tight mb-3">Quality Position</h2>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-4">
              Where do you sit on the cost-to-quality spectrum?
            </p>
            <div className="flex gap-1.5 mb-3">
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => setForm({ ...form, qualityVsCost: v })}
                  className={`w-12 h-8 font-mono text-[10px] transition-colors ${
                    form.qualityVsCost === v
                      ? "bg-foreground text-background"
                      : "bg-foreground/10 text-muted-foreground hover:bg-foreground/20"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <QualityScale value={form.qualityVsCost} />
          </div>

          <div className="divider-editorial" />

          {/* Production details */}
          <div className="space-y-4">
            <h2 className="font-display text-sm font-700 uppercase tracking-tight">Production</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="MOQ Min"
                value={String(form.moqMin)}
                onChange={(v) => setForm({ ...form, moqMin: Number(v) || 0 })}
                type="number"
              />
              <Field
                label="MOQ Max"
                value={String(form.moqMax)}
                onChange={(v) => setForm({ ...form, moqMax: Number(v) || 0 })}
                type="number"
              />
            </div>
            <Field
              label="Avg Lead Time (days)"
              value={String(form.leadTimeDays)}
              onChange={(v) => setForm({ ...form, leadTimeDays: Number(v) || 0 })}
              type="number"
            />
          </div>

          <div className="divider-editorial" />

          {/* Certifications */}
          <div>
            <h2 className="font-display text-sm font-700 uppercase tracking-tight mb-3">Certifications</h2>
            <div className="flex flex-wrap gap-1.5">
              {ALL_CERTS.map((cert) => (
                <button
                  key={cert}
                  onClick={() => toggleCert(cert)}
                  className={`font-mono text-[10px] px-3 py-1.5 uppercase tracking-wider transition-colors ${
                    form.certifications.includes(cert)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground border border-foreground/10"
                  }`}
                >
                  {form.certifications.includes(cert) && <span className="mr-1">✓</span>}
                  {cert}
                </button>
              ))}
            </div>
          </div>

          <div className="divider-editorial" />

          {/* Description */}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
              Factory Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors resize-none"
            />
          </div>

          {/* Save */}
          <Button variant="editorial" size="lg" onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" /> Save Profile
          </Button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground focus:outline-none focus:border-foreground transition-colors"
      />
    </div>
  );
}
