"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
} from "lucide-react";
import { useTranslation } from "@/components/providers/I18nProvider";
import { ARABIC_FONTS, LATIN_FONTS, loadFont } from "@/lib/fonts";

export default function RightPanel() {
  const { t } = useTranslation();
  const { layers, activeLayerId, updateTextLayer } = useEditorStore();

  const activeLayer = layers.find((l) => l.id === activeLayerId);

  if (!activeLayer) {
    return (
      <aside className="w-80 border-s bg-background flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <p>No layer selected</p>
        <p className="text-xs mt-2">Click on a text element to edit its properties.</p>
      </aside>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = (updates: any) => {
    updateTextLayer(activeLayer.id, updates);
  };

  return (
    <aside className="w-80 border-s bg-background flex flex-col">
      <div className="h-14 border-b flex items-center px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider shrink-0 bg-muted/30">
        {t("text", "panels")}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* FONT FAMILY & WEIGHT */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Typography</Label>
            
            <Select 
              value={activeLayer.fontFamily || ""} 
              onValueChange={(val: string | null) => {
                if (val) {
                  loadFont(val);
                  handleUpdate({ fontFamily: val });
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Font Family" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Latin Fonts</SelectLabel>
                  {LATIN_FONTS.map((font) => (
                    <SelectItem key={font.name} value={font.name} style={{ fontFamily: font.name }}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Arabic Fonts</SelectLabel>
                  {ARABIC_FONTS.map((font) => (
                    <SelectItem key={font.name} value={font.name} style={{ fontFamily: font.name }}>
                      {font.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={activeLayer.fontWeight} 
                onValueChange={(val) => handleUpdate({ fontWeight: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Regular</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="italic">Italic</SelectItem>
                  <SelectItem value="bold italic">Bold Italic</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md px-3 h-10 shadow-sm">
                <Input 
                  type="number" 
                  value={Math.round(activeLayer.fontSize)} 
                  onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                  className="border-0 p-0 h-6 focus-visible:ring-0 text-end me-1"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* COLOR */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Color</Label>
            <div className="flex items-center space-x-2">
              <div 
                className="w-10 h-10 rounded shadow-sm border overflow-hidden shrink-0 cursor-pointer relative"
              >
                <input
                  type="color"
                  value={activeLayer.fill}
                  onChange={(e) => handleUpdate({ fill: e.target.value })}
                  className="absolute inset-[-10px] w-16 h-16 cursor-pointer"
                />
              </div>
              <Input 
                value={activeLayer.fill} 
                onChange={(e) => handleUpdate({ fill: e.target.value })}
                className="flex-1 uppercase font-mono text-sm"
              />
            </div>
          </div>

          <Separator />

          {/* ALIGNMENT CASED */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Alignment & Case</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <ToggleGroup 
                type="single" 
                // @ts-expect-error: Radix strict overload mismatch
                value={activeLayer.align as string} 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onValueChange={(val: any) => val && handleUpdate({ align: val })}
                className="justify-start inline-flex border rounded-md overflow-hidden bg-muted/20"
              >
                <ToggleGroupItem value="left" aria-label="Left align" className="rounded-none px-2.5 flex-1 data-[state=on]:bg-muted">
                  <AlignLeft className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Center align" className="rounded-none px-2.5 flex-1 data-[state=on]:bg-muted">
                  <AlignCenter className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Right align" className="rounded-none px-2.5 flex-1 data-[state=on]:bg-muted">
                  <AlignRight className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              <ToggleGroup 
                type="single" 
                // @ts-expect-error: Radix strict overload mismatch
                value={activeLayer.textTransform as string} 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onValueChange={(val: any) => val && handleUpdate({ textTransform: val })}
                className="justify-start inline-flex border rounded-md overflow-hidden bg-muted/20"
              >
                <ToggleGroupItem value="none" aria-label="Normal case" className="rounded-none px-2 flex-1 data-[state=on]:bg-muted font-serif">
                  Aa
                </ToggleGroupItem>
                <ToggleGroupItem value="lowercase" aria-label="Lowercase" className="rounded-none px-2 flex-1 data-[state=on]:bg-muted font-serif lowercase">
                  aa
                </ToggleGroupItem>
                <ToggleGroupItem value="uppercase" aria-label="Uppercase" className="rounded-none px-2 flex-1 data-[state=on]:bg-muted font-serif uppercase">
                  AA
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          <Separator />

          {/* SPACING */}
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase">Spacing</Label>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  Lettter Spacing
                </span>
                <span className="font-mono">{activeLayer.letterSpacing}</span>
              </div>
              <Slider 
                value={[activeLayer.letterSpacing]} 
                min={-2} 
                max={20} 
                step={0.5}
                onValueChange={(val: number | readonly number[]) => {
                  const num = Array.isArray(val) || typeof val !== 'number' ? (val as readonly number[])[0] : val;
                  handleUpdate({ letterSpacing: num || 0 });
                }} 
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  Line Height
                </span>
                <span className="font-mono">{activeLayer.lineHeight}</span>
              </div>
              <Slider 
                value={[activeLayer.lineHeight]} 
                min={0.5} 
                max={2.5} 
                step={0.1}
                onValueChange={(val: number | readonly number[]) => {
                  const num = Array.isArray(val) || typeof val !== 'number' ? (val as readonly number[])[0] : val;
                  handleUpdate({ lineHeight: num || 1 });
                }} 
              />
            </div>
          </div>

        </div>
      </ScrollArea>
    </aside>
  );
}
