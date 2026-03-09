import { Link } from "react-router-dom";
import { GitCompare, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorActions, VENDORS } from "@/lib/vendors";

const COMPARE_FIELDS = [
  { label: "Region", key: "region" as const },
  { label: "Category", key: "category" as const },
  { label: "Quality Tier", key: "tier" as const },
  { label: "MOQ Range", gated: true },
  { label: "Lead Time", gated: true },
  { label: "Capabilities", gated: true },
];

export default function CompareVendors() {
  const { compareIds, toggleCompare, clearCompare } = useVendorActions();
  const vendors = VENDORS.filter((v) => compareIds.includes(v.id));

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="container py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Side by Side</p>
          <h1 className="font-display text-2xl md:text-4xl font-800 uppercase tracking-tight">Compare Manufacturers</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Compare up to 3 manufacturers side by side to find the best fit for your project.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-8">
          {vendors.length === 0 ? (
            <div className="text-center py-20">
              <GitCompare className="h-6 w-6 mx-auto mb-4 text-muted-foreground/30" />
              <p className="font-body text-sm text-muted-foreground mb-2">No manufacturers selected for comparison</p>
              <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-6">
                Browse manufacturers and click "Compare" to add them here (up to 3)
              </p>
              <Link to="/vendors">
                <Button variant="editorial" size="lg">Browse Manufacturers <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {vendors.length} of 3 slots used
                </p>
                <button
                  onClick={clearCompare}
                  className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  Clear all
                </button>
              </div>

              {/* Comparison table */}
              <div className="border border-foreground/10 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="p-4 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-40">Field</th>
                      {vendors.map((v) => (
                        <th key={v.id} className="p-4 text-left">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-body text-sm font-600">{v.name}</p>
                              <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase inline-block mt-1">{v.region}</span>
                            </div>
                            <button
                              onClick={() => toggleCompare(v.id)}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                              title="Remove"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_FIELDS.map((field) => (
                      <tr key={field.label} className="border-b border-foreground/5">
                        <td className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{field.label}</td>
                        {vendors.map((v) => (
                          <td key={v.id} className="p-4">
                            {field.gated ? (
                              <span className="font-mono text-[10px] text-muted-foreground/40 uppercase tracking-wider">Sign up to view</span>
                            ) : (
                              <span className="font-body text-sm">{v[field.key]}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Action row */}
                    <tr>
                      <td className="p-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Action</td>
                      {vendors.map((v) => (
                        <td key={v.id} className="p-4">
                          <Link
                            to={`/brief?vendor=${v.id}&vendorName=${encodeURIComponent(v.name)}`}
                            className="font-mono text-[10px] text-signal hover:text-signal/80 transition-colors uppercase tracking-wider flex items-center gap-1"
                          >
                            Start Project <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {vendors.length < 3 && (
                <div className="mt-6 text-center">
                  <Link to="/vendors">
                    <Button variant="ghost" size="sm">
                      Add more manufacturers to compare <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
