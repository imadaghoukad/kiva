"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const state = useEditorStore.getState();

      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "d": 
            e.preventDefault();
            if (state.activeLayerId) {
              state.duplicateLayer(state.activeLayerId);
            }
            break;
          case "s":
            e.preventDefault();
            state.saveDesign();
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
               useEditorStore.temporal.getState().redo();
            } else {
               useEditorStore.temporal.getState().undo();
            }
            break;
          case "y":
            e.preventDefault();
            useEditorStore.temporal.getState().redo();
            break;
        }
        return;
      }

      // Standalone keys
      if (e.key === "Delete" || e.key === "Backspace") {
        if (state.activeLayerId && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          state.removeTextLayer(state.activeLayerId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
