"use client";

import Link from "next/link";
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

  // Find current preset name to display
  const currentPresetName = Object.entries(PRESETS).find(
    ([_, dims]) => dims.width === canvasSize.width && dims.height === canvasSize.height
  )?.[0] || "Custom Size";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" type="button" onClick={() => window.location.href = '/designs'}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="font-semibold hidden sm:inline-block">Untitled Design</span>
        
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
        
        <Button variant="secondary" size="sm" onClick={addTextLayer} className="h-8 gap-2">
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline-block">Add Text</span>
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-sm text-muted-foreground mr-4 hidden md:block">
          Unsaved changes
        </div>
        <Button variant="outline" size="sm">Save</Button>
        <Button size="sm">Export</Button>
      </div>
    </header>
  );
}
