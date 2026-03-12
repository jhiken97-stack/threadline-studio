import { Link } from "react-router-dom";
import { Bookmark, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVendorActions, VENDORS } from "@/lib/vendors";
import { QualityScale } from "@/components/QualityScale";

export default function SavedVendors() {
  const { savedIds, toggleSave } = useVendorActions();
  const saved = VENDORS.filter((v) => savedIds.includes(v.id));

  return (
    <div>
      <section className="border-b border-foreground/10">
        <div className="container py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Your Collection</p>
          <h1 className="font-display text-2xl md:text-4xl font-800 uppercase tracking-tight">Saved Manufacturers</h1>
          <p className="font-body text-sm text-muted-foreground mt-2">
            Manufacturers you've bookmarked for later. Start a project with any of them when you're ready.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-8">
          {saved.length === 0 ? (
            <div className="text-center py-20">
              <Bookmark className="h-6 w-6 mx-auto mb-4 text-muted-foreground/30" />
              <p className="font-body text-sm text-muted-foreground mb-2">No saved manufacturers yet</p>
              <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-6">
                Browse manufacturers and click "Save" to bookmark them here
              </p>
              <Link to="/vendors">
                <Button variant="editorial" size="lg">Browse Manufacturers <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
                {saved.length} saved
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10">
                {saved.map((vendor) => (
                  <div key={vendor.id} className="bg-background p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-body text-sm font-600">{vendor.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[10px] px-2 py-0.5 bg-foreground text-background uppercase">{vendor.region}</span>
                          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{vendor.category}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSave(vendor.id)}
                        className="p-1 text-signal hover:text-destructive transition-colors"
                        title="Remove from saved"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed mb-3">{vendor.summary}</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-foreground/5">
                      <Link
                        to={`/brief?vendor=${vendor.id}&vendorName=${encodeURIComponent(vendor.name)}`}
                        className="font-mono text-[10px] text-signal hover:text-signal/80 transition-colors uppercase tracking-wider flex items-center gap-1"
                      >
                        Start Project <ArrowRight className="h-3 w-3" />
                      </Link>
                      <span className="font-mono text-[10px] px-2 py-0.5 border border-foreground/15 uppercase tracking-wider text-muted-foreground ml-auto">{vendor.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
