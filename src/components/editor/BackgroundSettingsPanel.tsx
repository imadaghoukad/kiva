"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

type BackgroundSettingsUpdate = Partial<{
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  overlayOpacity: number;
  overlayColor: string;
}>;

export default function BackgroundSettingsPanel() {
  const { bgImageUrl, bgImageSettings, setBgImageSettings } = useEditorStore();

  const handleUpdate = (updates: BackgroundSettingsUpdate) => {
    setBgImageSettings(updates);
  };

  if (!bgImageUrl) {
    return (
      <aside className="w-80 border-s bg-background flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <p>No background image</p>
        <p className="text-xs mt-2">Upload or drag & drop an image to adjust its settings.</p>
      </aside>
    );
  }

  return (
    <aside className="w-80 border-s bg-background flex flex-col">
      <div className="h-14 border-b flex items-center px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider shrink-0 bg-muted/30">
        Background Settings
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Image Filters</Label>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Brightness</span>
                <span className="font-mono">{Math.round((bgImageSettings.brightness || 0) * 100)}%</span>
              </div>
              <Slider 
                value={[bgImageSettings.brightness || 0]} 
                min={-1} 
                max={1} 
                step={0.05}
                onValueChange={(val: number | readonly number[]) => handleUpdate({ brightness: Array.isArray(val) ? val[0] : val })} 
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Contrast</span>
                <span className="font-mono">{Math.round((bgImageSettings.contrast || 0) * 100)}%</span>
              </div>
              <Slider 
                value={[bgImageSettings.contrast || 0]} 
                min={-100} 
                max={100} 
                step={5}
                onValueChange={(val: number | readonly number[]) => handleUpdate({ contrast: Array.isArray(val) ? val[0] : val })} 
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Saturation</span>
                <span className="font-mono">{Math.round((bgImageSettings.saturation || 0) * 100)}%</span>
              </div>
              <Slider 
                value={[bgImageSettings.saturation || 0]} 
                min={-1} 
                max={1} 
                step={0.05}
                onValueChange={(val: number | readonly number[]) => handleUpdate({ saturation: Array.isArray(val) ? val[0] : val })} 
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Blur</span>
                <span className="font-mono">{bgImageSettings.blur || 0}px</span>
              </div>
              <Slider 
                value={[bgImageSettings.blur || 0]} 
                min={0} 
                max={40} 
                step={1}
                onValueChange={(val: number | readonly number[]) => handleUpdate({ blur: Array.isArray(val) ? val[0] : val })} 
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Dim Overlay</Label>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded shadow-sm border overflow-hidden shrink-0 cursor-pointer relative">
                <input
                  type="color"
                  value={bgImageSettings.overlayColor || "#000000"}
                  onChange={(e) => handleUpdate({ overlayColor: e.target.value })}
                  className="absolute inset-[-10px] w-16 h-16 cursor-pointer"
                />
              </div>
              <Input 
                value={bgImageSettings.overlayColor || "#000000"} 
                onChange={(e) => handleUpdate({ overlayColor: e.target.value })}
                className="flex-1 uppercase font-mono text-sm"
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Opacity</span>
                <span className="font-mono">{Math.round((bgImageSettings.overlayOpacity || 0) * 100)}%</span>
              </div>
              <Slider 
                value={[bgImageSettings.overlayOpacity || 0]} 
                min={0} 
                max={1} 
                step={0.05}
                onValueChange={(val: number | readonly number[]) => handleUpdate({ overlayOpacity: Array.isArray(val) ? val[0] : val })} 
              />
            </div>
          </div>

        </div>
      </ScrollArea>
    </aside>
  );
}
