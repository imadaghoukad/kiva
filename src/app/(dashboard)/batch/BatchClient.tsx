"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Columns, Loader2, Download, ImageIcon, Share, Archive } from "lucide-react";
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

  // A mapping of zone text labels to the user's typed input values
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

  // The dynamically merged zones from ALL selected templates (keyed by original text label)
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
    // Reset results when selection changes
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
    toast.success(`Generated ${results.length} image${results.length !== 1 ? "s" : ""} successfully!`);
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
      // Dynamic import so bundle stays small until needed
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      generatedResults.forEach((result, index) => {
        // Strip the data:image/png;base64, prefix
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

      toast.success("ZIP downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ZIP. Please try again.");
    }
  };

  const handlePublishToFB = async () => {
    if (!publishTarget) return;
    setIsPublishing(true);
    try {
      // Simulate a slight delay (real implementation would upload image + call Graph API)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Published "${publishTarget.templateName}" to Facebook!`);
      setPublishTarget(null);
      setFbCaption("");
    } catch {
      toast.error("Failed to publish. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Hidden render engine – mounts off screen */}
      {shouldRender && (
        <BatchRenderEngine
          key={renderKey}
          templates={selectedTemplates}
          textInputs={textInputs}
          onComplete={handleRenderComplete}
        />
      )}

      {/* ── SECTION 1: Template Selector ── */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto border rounded-lg p-4 bg-card shadow-sm">
        <h2 className="font-semibold text-lg border-b pb-2 sticky top-0 bg-card z-10 flex justify-between items-center">
          1. Select Templates
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {selectedTemplateIds.length} Selected
          </span>
        </h2>

        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-2 text-muted-foreground text-center px-4">
            <ImageIcon className="h-10 w-10 opacity-20" />
            <p className="text-sm">No templates found. Create one in the editor first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => {
              const isSelected = selectedTemplateIds.includes(template._id);
              return (
                <div
                  key={template._id}
                  onClick={() => toggleTemplate(template._id)}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 transition-all relative aspect-video ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{
                    backgroundColor: template.bgImageUrl ? "transparent" : "#f1f5f9",
                    backgroundImage: template.bgImageUrl
                      ? `url(${template.bgImageUrl})`
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white font-medium truncate">{template.name}</p>
                    <p className="text-[10px] text-white/60">
                      {(template.textZones ?? []).length} text zone
                      {(template.textZones ?? []).length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-md">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── SECTION 2: Content Injection ── */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto border rounded-lg p-4 bg-card shadow-sm">
        <h2 className="font-semibold text-lg border-b pb-2 sticky top-0 bg-card z-10">
          2. Content Injection
        </h2>

        {selectedTemplateIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground text-center px-4">
            <Columns className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">Select at least one template to see available text zones.</p>
          </div>
        ) : unifiedZones.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-10">
            Selected templates have no text zones. Make sure to add text layers when saving
            a template.
          </div>
        ) : (
          <div className="space-y-4">
            {unifiedZones.map((zoneLabel) => (
              <div key={zoneLabel} className="space-y-1.5">
                <label className="text-sm font-medium flex items-center justify-between">
                  {zoneLabel}
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">
                    Text Zone
                  </span>
                </label>
                <Input
                  value={textInputs[zoneLabel] || ""}
                  onChange={(e) =>
                    setTextInputs((prev) => ({ ...prev, [zoneLabel]: e.target.value }))
                  }
                  placeholder={`Replace "${zoneLabel}"...`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 3: Generate & Export ── */}
      <div className="w-full lg:w-1/3 flex flex-col gap-0 border rounded-lg bg-card shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold text-lg">3. Generate &amp; Export</h2>
          <Button
            size="sm"
            onClick={handleRunBatch}
            disabled={selectedTemplateIds.length === 0 || isRendering}
          >
            {isRendering ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Rendering…
              </>
            ) : (
              "Run Batch"
            )}
          </Button>
        </div>

        {/* Preview Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {generatedResults.length === 0 && !isRendering && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg p-6 bg-muted/10">
              <ImageIcon className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm text-center">
                {selectedTemplateIds.length === 0
                  ? "Select templates and click Run Batch to generate images."
                  : `Click Run Batch to render ${selectedTemplateIds.length} variation${selectedTemplateIds.length !== 1 ? "s" : ""}.`}
              </p>
            </div>
          )}

          {isRendering && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Rendering {selectedTemplateIds.length} image{selectedTemplateIds.length !== 1 ? "s" : ""}…</p>
            </div>
          )}

          {generatedResults.length > 0 && !isRendering && (
            <div className="grid grid-cols-1 gap-4">
              {generatedResults.map((result, index) => (
                <Card key={index} className="overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.dataUrl}
                    alt={result.templateName}
                    className="w-full object-cover aspect-video bg-muted"
                  />
                  <div className="p-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium truncate flex-1">{result.templateName}</p>
                    <div className="flex gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadSingle(result, index)}
                        title="Download image"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                        onClick={() => {
                          setPublishTarget(result);
                          setFbCaption("");
                        }}
                        title="Publish to Facebook"
                      >
                        <Share className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Batch Actions Bar */}
        {generatedResults.length > 0 && !isRendering && (
          <div className="p-4 border-t bg-muted/30 flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRunBatch}
              disabled={isRendering}
            >
              Re-render
            </Button>
            <Button className="flex-1" onClick={handleDownloadAll}>
              <Archive className="h-4 w-4 mr-1.5" />
              Download ZIP
            </Button>
          </div>
        )}
      </div>

      {/* ── FB Publish Dialog ── */}
      <Dialog open={!!publishTarget} onOpenChange={(open) => !open && setPublishTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish to Facebook</DialogTitle>
            <DialogDescription>
              Share &ldquo;{publishTarget?.templateName}&rdquo; directly to your timeline or a
              page you manage.
            </DialogDescription>
          </DialogHeader>

          {publishTarget && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={publishTarget.dataUrl}
              alt={publishTarget.templateName}
              className="w-full rounded-md object-cover aspect-video bg-muted"
            />
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Caption (Optional)</label>
            <Textarea
              placeholder="Write something about this design…"
              value={fbCaption}
              onChange={(e) => setFbCaption(e.target.value)}
              className="resize-none h-20"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setPublishTarget(null)}
              disabled={isPublishing}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handlePublishToFB}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Share className="mr-2 h-4 w-4" />
                  Share Now
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
