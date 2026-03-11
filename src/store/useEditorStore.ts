import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

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
  
  addTextLayer: () => void;
  updateTextLayer: (id: string, updates: Partial<TextLayer>) => void;
  setActiveLayerId: (id: string | null) => void;
  
  // Layer list controls
  removeTextLayer: (id: string) => void;
  reorderLayer: (id: string, direction: "up" | "down" | "top" | "bottom") => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
}

export const PRESETS = {
  "Facebook Post": { width: 1200, height: 630 },
  "Instagram Square": { width: 1080, height: 1080 },
  "Instagram Story": { width: 1080, height: 1920 },
  "Facebook Cover": { width: 820, height: 312 },
};

export const useEditorStore = create<EditorState>((set) => ({
  canvasSize: PRESETS["Facebook Post"],
  setCanvasSize: (size) => set({ canvasSize: size }),

  bgImageUrl: null,
  setBgImageUrl: (url) => set({ bgImageUrl: url }),

  layers: [],
  activeLayerId: null,

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
}));
