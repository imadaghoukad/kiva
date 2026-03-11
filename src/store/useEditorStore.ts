import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export type Dimensions = {
  width: number;
  height: number;
};

export type TextLayer = {
  id: string;
  type: "text";
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  rotation: number;
  // Advanced text styling
  fontWeight: string;
  align: "left" | "center" | "right" | "justify";
  letterSpacing: number;
  lineHeight: number;
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
  // Layer controls
  visible: boolean;
  locked: boolean;
};

interface EditorState {
  canvasSize: Dimensions;
  setCanvasSize: (size: Dimensions) => void;
  
  bgImageUrl: string | null;
  setBgImageUrl: (url: string | null) => void;

  layers: TextLayer[];
  activeLayerId: string | null;
  designId: string | null;
  designName: string;
  isSaving: boolean;
  lastSaved: Date | null;

  // Actions
  setDesignId: (id: string | null) => void;
  setDesignName: (name: string) => void;
  addTextLayer: () => void;
  updateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  setActiveLayerId: (id: string | null) => void;
  
  // Layer list controls
  removeTextLayer: (id: string) => void;
  reorderLayer: (id: string, direction: "up" | "down" | "top" | "bottom") => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;

  // Template hydration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applyTemplate: (template: any) => void;

  // Persistence
  saveDesign: () => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadDesign: (design: any) => void;
  
  // Export Hook
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stageRef: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStageRef: (ref: any) => void;
}

export const PRESETS = {
  "Facebook Post": { width: 1200, height: 630 },
  "Instagram Square": { width: 1080, height: 1080 },
  "Instagram Story": { width: 1080, height: 1920 },
  "Facebook Cover": { width: 820, height: 312 },
};

export const useEditorStore = create<EditorState>((set, get) => ({
  canvasSize: PRESETS["Facebook Post"],
  setCanvasSize: (size) => set({ canvasSize: size }),

  bgImageUrl: null,
  setBgImageUrl: (url) => set({ bgImageUrl: url }),

  layers: [],
  activeLayerId: null,
  designId: null,
  designName: "Untitled Design",
  isSaving: false,
  lastSaved: null,
  stageRef: null,

  setDesignId: (id) => set({ designId: id }),
  setDesignName: (name) => set({ designName: name }),
  setStageRef: (ref) => set({ stageRef: ref }),

  addTextLayer: () =>
    set((state) => {
      const newLayer: TextLayer = {
        id: uuidv4(),
        type: "text",
        text: "Double click to edit",
        x: state.canvasSize.width / 2 - 100,
        y: state.canvasSize.height / 2 - 20,
        fontSize: 40,
        fontFamily: "Arial",
        fill: "#000000",
        rotation: 0,
        fontWeight: "normal",
        align: "left",
        letterSpacing: 0,
        lineHeight: 1.2,
        textTransform: "none",
        visible: true,
        locked: false,
      };
      return { layers: [...state.layers, newLayer], activeLayerId: newLayer.id };
    }),

  updateTextLayer: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, ...updates } : layer
      ),
    })),

  setActiveLayerId: (id) => set({ activeLayerId: id }),

  removeTextLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
      activeLayerId: state.activeLayerId === id ? null : state.activeLayerId,
    })),

  reorderLayer: (id, direction) =>
    set((state) => {
      const index = state.layers.findIndex((l) => l.id === id);
      if (index < 0) return state;

      const newLayers = [...state.layers];
      const layer = newLayers.splice(index, 1)[0];

      if (direction === "up") {
        newLayers.splice(Math.min(index + 1, newLayers.length), 0, layer);
      } else if (direction === "down") {
        newLayers.splice(Math.max(index - 1, 0), 0, layer);
      } else if (direction === "top") {
        newLayers.push(layer);
      } else if (direction === "bottom") {
        newLayers.unshift(layer);
      }

      return { layers: newLayers };
    }),

  toggleLayerVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) => {
        if (layer.id === id) {
          const newVisible = !layer.visible;
          // Deselect layer if it's being hidden
          if (!newVisible && state.activeLayerId === id) {
            state.activeLayerId = null;
          }
          return { ...layer, visible: newVisible };
        }
        return layer;
      }),
    })),

  toggleLayerLock: (id) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, locked: !layer.locked } : layer
      ),
    })),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applyTemplate: (template: any) =>
    set(() => {
      // Map MongoDB textZones onto our local Zustand TextLayers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedLayers: TextLayer[] = template.textZones.map((zone: any) => ({
        ...zone,
        type: 'text',
      }));

      toast.success("Template applied to canvas");

      return {
        canvasSize: template.canvasSize,
        bgImageUrl: template.bgImageUrl,
        layers: mappedLayers,
        activeLayerId: null, // Clear selection
      };
    }),
    
  saveDesign: async () => {
    const state = get();
    set({ isSaving: true });
    try {
      const payload = {
        name: state.designName,
        canvasSize: state.canvasSize,
        bgImageUrl: state.bgImageUrl,
        layers: state.layers,
      };

      if (state.designId) {
        // Update existing
        await fetch(`/api/designs/${state.designId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new
        const res = await fetch("/api/designs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          set({ designId: data._id });
          toast.success("Design created successfully!");
        } else {
          toast.error("Failed to create design.");
        }
      }
      set({ lastSaved: new Date() });
      if (state.designId) {
        toast.success("Design saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save design", error);
      toast.error("An error occurred while saving.");
    } finally {
      set({ isSaving: false });
    }
  },

  loadDesign: (design) => 
    set(() => ({
      designId: design._id,
      designName: design.name,
      canvasSize: design.canvasSize,
      bgImageUrl: design.bgImageUrl || null,
      layers: design.layers || [],
      activeLayerId: null,
    })),
}));
