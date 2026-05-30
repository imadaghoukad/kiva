"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Compass, Heart, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type GalleryTemplate = {
  _id: string;
  name: string;
  bgImageUrl?: string | null;
  authorName?: string;
  usageCount?: number;
};

export default function GalleryPage() {
  const [templates, setTemplates] = useState<GalleryTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = (await res.json()) as GalleryTemplate[];
        // Since templates API doesn't sort by usageCount yet, we sort it on client
        // Or wait, the backend will sort it if we update it. Let's ensure it's sorted here.
        setTemplates([...data].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load community gallery.");
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const handleReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/templates/${id}/report`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to report");
      toast.success("Template reported for review. Thank you for keeping the community safe.");
    } catch {
      toast.error("Could not report the template at this time.");
    }
  };

  const handleUseTemplate = (template: GalleryTemplate) => {
    // Navigate to editor with this template.
    // Right now editor uses Zustand store. A simple way is to pass `?templateId=xxx` to /editor
    // Assuming /editor handles it, or just direct them to create a new design from template.
    // For MVp, let's navigate to editor and use URL params if supported, or just alert.
    toast.info("Opening editor with template...");
    router.push(`/editor?templateId=${template._id}`);
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Compass className="h-8 w-8 text-primary" />
            Community Gallery
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Discover top templates crafted by the community.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search templates..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-white/10 bg-muted/30 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-white/5 rounded-2xl">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-20 bg-muted/10 rounded-3xl border border-white/5 border-dashed">
           <Compass className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
           <h3 className="text-xl font-bold">No templates found</h3>
           <p className="text-muted-foreground text-sm">Be the first to share a template to the community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map(t => (
            <Card key={t._id} className="group overflow-hidden rounded-2xl border-white/5 bg-background shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div 
                className="aspect-[4/3] w-full bg-muted relative"
                style={{
                  backgroundImage: t.bgImageUrl ? `url(${t.bgImageUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!t.bgImageUrl && (
                   <div className="absolute inset-0 flex items-center justify-center opacity-10">
                     <Compass className="w-12 h-12" />
                   </div>
                )}
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                   <Button onClick={() => handleUseTemplate(t)} className="w-full rounded-xl font-bold shadow-lg shadow-primary/20">
                     Use Template
                   </Button>
                   <Button variant="outline" size="sm" onClick={(e) => handleReport(t._id, e)} className="text-xs absolute top-2 right-2 h-8 w-8 p-0 rounded-full border-white/20 bg-black/40 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30">
                     <AlertTriangle className="h-4 w-4" />
                   </Button>
                </div>
              </div>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold truncate">{t.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">By {t.authorName || 'Anonymous'}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full border border-white/5">
                   <Heart className="h-3 w-3 text-red-400" />
                   {t.usageCount || 0}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
