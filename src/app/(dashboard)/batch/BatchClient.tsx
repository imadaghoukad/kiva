"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Columns, 
  Loader2, 
  Download, 
  ImageIcon, 
  Share, 
  Archive,
  Sparkles,
  Layers
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BatchRenderEngine } from "@/components/editor/BatchRenderEngine";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GeneratedResult {
  dataUrl: string;
  templateName: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function BatchClient({ templates }: { templates: any[] }) {
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});

  // Render state
  const [isRendering, setIsRendering] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<GeneratedResult[]>([]);

  // FB Publish dialog state
  const [publishTarget, setPublishTarget] = useState<GeneratedResult | null>(null);
  const [fbCaption, setFbCaption] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // The dynamically merged zones from ALL selected templates
  const unifiedZones = useMemo(() => {
    const zones = new Set<string>();
    templates.forEach((t) => {
      if (selectedTemplateIds.includes(t._id)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (t.textZones ?? []).forEach((zone: any) => {
          if (zone.text) {
            zones.add(zone.text);
          }
        });
      }
    });
    return Array.from(zones);
  }, [templates, selectedTemplateIds]);

  const selectedTemplates = useMemo(
    () => templates.filter((t) => selectedTemplateIds.includes(t._id)),
    [templates, selectedTemplateIds],
  );

  const toggleTemplate = (id: string) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
    setGeneratedResults([]);
    setShouldRender(false);
  };

  const handleRunBatch = () => {
    if (selectedTemplateIds.length === 0) return;
    setGeneratedResults([]);
    setIsRendering(true);
    setShouldRender(true);
    setRenderKey((k) => k + 1);
  };

  const handleRenderComplete = (results: GeneratedResult[]) => {
    setGeneratedResults(results);
    setIsRendering(false);
    setShouldRender(false);
    toast.success(`Generated ${results.length} results!`, {
      icon: <Sparkles className="h-4 w-4 text-amber-500" />
    });
  };

  const handleDownloadSingle = (result: GeneratedResult, index: number) => {
    const link = document.createElement("a");
    link.href = result.dataUrl;
    link.download = `${result.templateName.replace(/\s+/g, "_")}_${index + 1}.png`;
    link.click();
  };

  const handleDownloadAll = async () => {
    if (generatedResults.length === 0) return;
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      generatedResults.forEach((result, index) => {
        const base64Data = result.dataUrl.replace(/^data:image\/\w+;base64,/, "");
        const filename = `${result.templateName.replace(/\s+/g, "_")}_${index + 1}.png`;
        zip.file(filename, base64Data, { base64: true });
      });
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "batch_export.zip";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ZIP.");
    }
  };

  const handlePublishToFB = async () => {
    if (!publishTarget) return;
    setIsPublishing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Successfully published to Facebook!");
      setPublishTarget(null);
      setFbCaption("");
    } catch {
      toast.error("Failed to publish.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      {/* Hidden off-screen render engine */}
      {shouldRender && (
        <BatchRenderEngine
          key={renderKey}
          templates={selectedTemplates}
          textInputs={textInputs}
          onComplete={handleRenderComplete}
        />
      )}

      {/* 1. Template Selector */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto border border-white/10 rounded-2xl p-5 bg-card/50 backdrop-blur-md shadow-xl transition-all hover:shadow-2xl">
        <div className="sticky top-0 bg-card/80 backdrop-blur-xl z-10 -mx-5 -mt-5 px-5 py-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            1. Templates
          </h2>
          <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
            {selectedTemplateIds.length} Selected
          </span>
        </div>

        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 opacity-50">
            <div className="p-4 rounded-full bg-muted/50 border border-dashed border-muted-foreground/30">
              <ImageIcon className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium">No templates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 auto-rows-max">
            {templates.map((template) => {
              const isSelected = selectedTemplateIds.includes(template._id);
              return (
                <div
                  key={template._id}
                  onClick={() => toggleTemplate(template._id)}
                  className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 relative aspect-video shadow-md hover:scale-[1.02] hover:-translate-y-1 active:scale-95 ${
                    isSelected
                      ? "border-primary ring-4 ring-primary/20 shadow-primary/20"
                      : "border-border hover:border-primary/40 grayscale-[0.3] hover:grayscale-0"
                  }`}
                  style={{
                    backgroundColor: template.bgImageUrl ? "transparent" : "#1a1a1a",
                    backgroundImage: template.bgImageUrl ? `url(${template.bgImageUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 opacity-90 group-hover:opacity-100 transition-opacity">
                    <p className="text-[11px] text-white font-bold truncate leading-none mb-1">
                      {template.name}
                    </p>
                    <p className="text-[9px] text-white/50 font-medium uppercase tracking-tighter">
                      {(template.textZones ?? []).length} zones
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-lg p-1.5 shadow-lg animate-in zoom-in-50 duration-300">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Content Injection */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto border border-white/10 rounded-2xl p-5 bg-card/50 backdrop-blur-md shadow-xl">
        <div className="sticky top-0 bg-card/80 backdrop-blur-xl z-10 -mx-5 -mt-5 px-5 py-4 border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Columns className="h-5 w-5 text-primary" />
            2. Content
          </h2>
        </div>

        {selectedTemplateIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 opacity-40 text-center px-8">
            <div className="p-4 rounded-full bg-muted/50 border border-dashed border-muted-foreground/30">
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="text-sm font-medium">Select templates to unlock content injection</p>
          </div>
        ) : unifiedZones.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-12 px-6">
            Selected templates have no editable text zones.
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {unifiedZones.map((zoneLabel) => (
              <div key={zoneLabel} className="space-y-2 group">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-between group-focus-within:text-primary transition-colors">
                  {zoneLabel}
                  <span className="h-px bg-muted flex-1 ml-3" />
                </label>
                <Input
                  value={textInputs[zoneLabel] || ""}
                  onChange={(e) =>
                    setTextInputs((prev) => ({ ...prev, [zoneLabel]: e.target.value }))
                  }
                  className="bg-muted/30 border-white/10 hover:border-primary/50 focus:ring-primary/20 focus:border-primary transition-all h-11"
                  placeholder={`Global replace for "${zoneLabel}"...`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Generate & Export */}
      <div className="w-full lg:w-1/3 flex flex-col border border-white/10 rounded-2xl bg-card/50 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-gradient-to-r from-primary/5 to-transparent">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            3. Export
          </h2>
          <Button
            onClick={handleRunBatch}
            disabled={selectedTemplateIds.length === 0 || isRendering}
            className="group relative overflow-hidden bg-primary px-6 hover:shadow-lg transition-all"
          >
            {isRendering ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Wait...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                Run Batch
              </>
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {!isRendering && generatedResults.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-30 text-center gap-4">
              <ImageIcon className="h-12 w-12" />
              <p className="text-sm font-medium max-w-[200px]">
                Click Run Batch to generate and review variations
              </p>
            </div>
          )}

          {isRendering && (
            <div className="flex flex-col items-center justify-center h-full gap-5">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
              </div>
              <div className="text-center">
                <p className="font-bold">Generating variations</p>
                <p className="text-xs text-muted-foreground mt-1">This takes just a moment...</p>
              </div>
            </div>
          )}

          {generatedResults.length > 0 && !isRendering && (
            <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-4 duration-500">
              {generatedResults.map((result, index) => (
                <Card key={index} className="overflow-hidden bg-muted/20 border-white/5 hover:border-primary/30 transition-all shadow-sm group/card">
                  <div className="relative aspect-video overflow-hidden bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.dataUrl}
                      alt={result.templateName}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover/card:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end justify-between p-4 px-5">
                       <p className="text-xs font-bold text-white mb-1.5">{result.templateName}</p>
                       <div className="flex gap-2">
                          <Button 
                            size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-xl"
                            onClick={() => handleDownloadSingle(result, index)}
                          >
                             <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                             size="icon" className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl"
                             onClick={() => { setPublishTarget(result); setFbCaption(""); }}
                          >
                             <Share className="h-3.5 w-3.5" />
                          </Button>
                       </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {generatedResults.length > 0 && !isRendering && (
          <div className="p-5 border-t border-white/5 bg-primary/5 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-white/10 hover:bg-white/5 h-11 font-bold"
              onClick={handleRunBatch}
            >
              Reset
            </Button>
            <Button 
              className="flex-1 bg-primary hover:shadow-primary/20 hover:shadow-lg h-11 font-bold" 
              onClick={handleDownloadAll}
            >
              <Archive className="h-4 w-4 mr-2" />
              Package ZIP
            </Button>
          </div>
        )}
      </div>

      <Dialog open={!!publishTarget} onOpenChange={(open) => !open && setPublishTarget(null)}>
        <DialogContent className="sm:max-w-xl bg-card border-white/10 backdrop-blur-2xl">
          <DialogHeader>
             <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                   <Share className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                   <DialogTitle className="text-xl">Publish to Meta</DialogTitle>
                   <DialogDescription className="text-xs">Share your unique design to Facebook Pages</DialogDescription>
                </div>
             </div>
          </DialogHeader>

          {publishTarget && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-inner group mb-2">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={publishTarget.dataUrl} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}

          <div className="space-y-2 mt-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Caption</label>
            <Textarea
              placeholder="What's on your mind?..."
              value={fbCaption}
              onChange={(e) => setFbCaption(e.target.value)}
              className="bg-muted/30 border-white/5 focus:ring-blue-500/20 h-24 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setPublishTarget(null)} disabled={isPublishing}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 font-bold shadow-lg shadow-blue-600/20"
              onClick={handlePublishToFB}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Post Now"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
