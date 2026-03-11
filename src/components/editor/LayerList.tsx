"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ArrowDownToLine,
  ArrowUpToLine,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LayerList() {
  const { 
    layers, 
    activeLayerId, 
    setActiveLayerId,
    toggleLayerVisibility,
    toggleLayerLock,
    removeTextLayer,
    reorderLayer
  } = useEditorStore();

  // Konva renders array strictly based on index [0, 1, 2] -> 0 is bottom, 2 is top
  // In UI, we usually expect the Top layer to be at the index 0 of the list
  const displayLayers = [...layers].reverse();

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden border-t">
      <div className="h-10 border-b flex items-center px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider shrink-0 bg-muted/30">
        Layers
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {displayLayers.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">
              No layers yet
            </div>
          )}
          {displayLayers.map((layer) => {
            const isActive = activeLayerId === layer.id;
            return (
              <div 
                key={layer.id}
                onClick={() => !layer.locked && layer.visible && setActiveLayerId(layer.id)}
                className={cn(
                  "group flex items-center h-10 px-2 rounded-md text-sm cursor-pointer border transition-colors",
                  isActive ? "bg-primary/10 border-primary/20 text-foreground font-medium" : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50",
                  (layer.locked || !layer.visible) && "opacity-60 cursor-default"
                )}
              >
                <div className="flex items-center text-muted-foreground/50 mr-2 cursor-grab active:cursor-grabbing">
                   {/* In a fully real app, we'd use react-beautiful-dnd here */}
                   <GripVertical className="h-4 w-4" />
                </div>
                
                <div className="flex-1 truncate mr-2">
                  {layer.text || "Empty text"}
                </div>
                
                {/* Actions (visible on hover or if active/locked/hidden) */}
                <div className={cn(
                  "flex items-center space-x-1",
                  !isActive && layer.visible && !layer.locked ? "opacity-0 group-hover:opacity-100 transition-opacity" : "opacity-100"
                )}>
                  {isActive && (
                    <div className="flex mr-2 space-x-0.5 bg-background rounded border shadow-sm">
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none rounded-l" onClick={(e) => { e.stopPropagation(); reorderLayer(layer.id, "up"); }}>
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-none rounded-r" onClick={(e) => { e.stopPropagation(); reorderLayer(layer.id, "down"); }}>
                         <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                  >
                    {layer.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7" 
                    onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                  >
                    {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-muted-foreground hover:text-destructive" 
                    onClick={(e) => { e.stopPropagation(); removeTextLayer(layer.id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
