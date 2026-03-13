import { useState } from "react";
import { Upload, FileText, Image, File, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectFeatures, type ProjectFile } from "@/lib/project-features";
import { useToast } from "@/hooks/use-toast";

const TYPE_ICONS: Record<ProjectFile["type"], typeof FileText> = {
  "tech-pack": FileText,
  "spec-sheet": File,
  design: Image,
  contract: FileText,
  other: File,
};

const TYPE_LABELS: Record<ProjectFile["type"], string> = {
  "tech-pack": "Tech Pack",
  "spec-sheet": "Spec Sheet",
  design: "Design File",
  contract: "Contract",
  other: "Document",
};

export function FileSharing({ projectId, role }: { projectId: number; role: "brand" | "vendor" }) {
  const { files, addFile } = useProjectFeatures();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const projectFiles = files.filter(f => f.projectId === projectId);

  const handleUpload = () => {
    setUploading(true);
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setTimeout(() => {
      addFile({
        projectId,
        name: `${role === "brand" ? "Brand" : "Vendor"}_Upload_${Date.now().toString(36)}.pdf`,
        type: "other",
        uploadedBy: role,
        date: today,
        size: "1.2 MB",
      });
      setUploading(false);
      toast({ title: "File uploaded", description: "Document added to project files." });
    }, 800);
  };

  if (projectFiles.length === 0 && role === "vendor") {
    return null; // Don't show empty state on vendor side
  }

  return (
    <div className="border border-foreground/10">
      <div className="flex items-center justify-between p-3 border-b border-foreground/10 bg-muted/30">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Files & Documents ({projectFiles.length})
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleUpload} disabled={uploading} className="h-7 px-2 font-mono text-[9px]">
          <Upload className="h-3 w-3 mr-1" /> {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {projectFiles.length > 0 ? (
        <div className="divide-y divide-foreground/5">
          {projectFiles.map(file => {
            const Icon = TYPE_ICONS[file.type];
            return (
              <div key={file.id} className="flex items-center gap-3 p-3 hover:bg-muted/20 transition-colors group">
                <div className="w-8 h-8 flex items-center justify-center bg-muted/50 flex-shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm truncate">{file.name}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    {TYPE_LABELS[file.type]} · {file.size} · {file.uploadedBy === "brand" ? "Brand" : "Vendor"} · {file.date}
                  </p>
                </div>
                <button
                  onClick={() => toast({ title: "Downloading…", description: file.name })}
                  className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Download
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-wider text-center py-6">
          No files uploaded yet
        </p>
      )}
    </div>
  );
}
