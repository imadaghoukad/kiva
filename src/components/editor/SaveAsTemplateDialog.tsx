"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "@/components/providers/I18nProvider";

export function SaveAsTemplateDialog() {
  const { t } = useTranslation();
  const canvasSize = useEditorStore((state) => state.canvasSize);
  const bgImageUrl = useEditorStore((state) => state.bgImageUrl);
  const layers = useEditorStore((state) => state.layers);
  
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("minimal");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAsTemplate = async () => {
    if (!name) {
      toast.error("Please enter a template name");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        category,
        canvasSize,
        bgImageUrl,
        isPublic,
        textZones: layers.map((layer) => ({
          ...layer,
          visible: true,
        })),
      };

      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save template");

      toast.success("Template saved successfully!");
      setOpen(false);
      setName("");
      setIsPublic(false);
    } catch (error) {
      console.error(error);
      toast.error("Could not save template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs">
        {t("saveAsTemplate") || "Save as Template"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Template Name</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="E.g. Summer Promo" 
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val || "minimal")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promo">Promo</SelectItem>
                <SelectItem value="quote">Quote</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div className="space-y-0.5">
              <Label>Make Public</Label>
              <div className="text-xs text-muted-foreground">
                Public templates require admin approval before appearing in the community gallery.
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
              className="h-4 w-4"
            />
          </div>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded-md">
            This will save your current canvas size, background image, and text layers as a reusable template.
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAsTemplate} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
