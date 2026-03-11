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
}));
