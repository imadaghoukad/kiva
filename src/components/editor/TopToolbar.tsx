"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Type } from "lucide-react";
import { useEditorStore, PRESETS } from "@/store/useEditorStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TopToolbar() {
  const canvasSize = useEditorStore((state) => state.canvasSize);
  const setCanvasSize = useEditorStore((state) => state.setCanvasSize);
  const addTextLayer = useEditorStore((state) => state.addTextLayer);
  const designName = useEditorStore((state) => state.designName);
  const setDesignName = useEditorStore((state) => state.setDesignName);
  const saveDesign = useEditorStore((state) => state.saveDesign);
  const isSaving = useEditorStore((state) => state.isSaving);
  const lastSaved = useEditorStore((state) => state.lastSaved);
  const stageRef = useEditorStore((state) => state.stageRef);
  const setActiveLayerId = useEditorStore((state) => state.setActiveLayerId);

  // Find current preset name to display
  const currentPresetName = Object.entries(PRESETS).find(
    ([, dims]) => dims.width === canvasSize.width && dims.height === canvasSize.height
  )?.[0] || "Custom Size";

  const handleExport = () => {
    if (!stageRef) return;
    
    // Clear selection so handles don't appear in export
    setActiveLayerId(null);
    
    // Slight delay to ensure React commits the selection removal before capturing
    setTimeout(() => {
      const dataURL = stageRef.toDataURL({ 
        pixelRatio: 2, // High DPI export
        mimeType: "image/png"
      });
      
      const link = document.createElement("a");
      link.download = `${designName || "export"}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 50);
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" type="button" onClick={() => window.location.href = '/designs'}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <input 
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          className="font-semibold hidden sm:inline-block bg-transparent border-0 focus:ring-0 w-48 truncate"
        />
        
        <div className="h-6 w-px bg-border mx-2" />
        
        <Select 
          value={currentPresetName} 
          onValueChange={(val) => {
            const dims = PRESETS[val as keyof typeof PRESETS];
            if (dims) setCanvasSize(dims);
          }}
        >
          <SelectTrigger className="w-[180px] h-8 text-xs bg-muted/50 border-0 focus:ring-0">
            <SelectValue placeholder="Canvas Size" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(PRESETS).map((preset) => (
              <SelectItem key={preset} value={preset}>
                {preset}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="h-6 w-px bg-border mx-2" />
        
        <Button variant="ghost" size="sm" onClick={addTextLayer} className="h-8 gap-2">
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline-block">Add Text</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        {lastSaved && (
          <div className="text-xs text-muted-foreground mr-4 hidden md:block">
            Saved {lastSaved.toLocaleTimeString()}
          </div>
        )}
        <Button variant="outline" size="sm" onClick={saveDesign} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" onClick={handleExport} disabled={!stageRef}>
          Export
        </Button>
      </div>
    </header>
  );
}
