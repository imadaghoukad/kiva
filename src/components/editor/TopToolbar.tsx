"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Type, Undo2, Redo2, Copy } from "lucide-react";
import { useEditorStore, PRESETS } from "@/store/useEditorStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/components/providers/I18nProvider";
import { useLocaleStore, Locale } from "@/store/useLocaleStore";
import { SaveAsTemplateDialog } from "./SaveAsTemplateDialog";
import { FacebookPreviewDialog } from "./FacebookPreviewDialog";
import { useSession } from "next-auth/react";
import Konva from "konva";

export default function TopToolbar() {
  const { t } = useTranslation();
  const { locale, setLocale, dir } = useLocaleStore();
  const canvasSize = useEditorStore((state) => state.canvasSize);
  const setCanvasSize = useEditorStore((state) => state.setCanvasSize);
  const addTextLayer = useEditorStore((state) => state.addTextLayer);
  const designName = useEditorStore((state) => state.designName);
  const setDesignName = useEditorStore((state) => state.setDesignName);
  const saveDesign = useEditorStore((state) => state.saveDesign);
  const isSaving = useEditorStore((state) => state.isSaving);
  const lastSaved = useEditorStore((state) => state.lastSaved);
  const stageRef = useEditorStore((state) => state.stageRef);
  const activeLayerId = useEditorStore((state) => state.activeLayerId);
  const setActiveLayerId = useEditorStore((state) => state.setActiveLayerId);
  const { data: session } = useSession();
  const editorTemporal = (useEditorStore as typeof useEditorStore & {
    temporal: {
      getState: () => {
        undo: () => void;
        redo: () => void;
      };
      <T>(selector: (state: { pastStates: unknown[]; futureStates: unknown[] }) => T): T;
    };
  }).temporal;

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
      let watermarkLayer: Konva.Layer | null = null;
      if (session?.user?.plan !== 'pro') {
        watermarkLayer = new Konva.Layer();
        const watermarkText = new Konva.Text({
          x: stageRef.width() - 220,
          y: stageRef.height() - 40,
          text: 'Made with PostCanvas',
          fontSize: 20,
          fontFamily: 'Arial',
          fill: 'rgba(255, 255, 255, 0.7)',
          stroke: 'rgba(0, 0, 0, 0.5)',
          strokeWidth: 1,
        });
        watermarkLayer.add(watermarkText);
        stageRef.add(watermarkLayer);
        stageRef.draw();
      }

      const dataURL = stageRef.toDataURL({
        pixelRatio: 2, // High DPI export
        mimeType: "image/png"
      });

      if (watermarkLayer) {
        watermarkLayer.destroy();
        stageRef.draw();
      }

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
          <ArrowLeft className={`h-5 w-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        </Button>
        <input
          value={designName}
          placeholder={t("untitledDesign")}
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
            <SelectValue placeholder={t("canvasSize")} />
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

        <Button variant="ghost" size="icon" onClick={() => editorTemporal.getState().undo()} disabled={editorTemporal((state) => state.pastStates.length === 0)}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => editorTemporal.getState().redo()} disabled={editorTemporal((state) => state.futureStates.length === 0)}>
          <Redo2 className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-2" />

        <Button variant="ghost" size="sm" onClick={addTextLayer} className="h-8 gap-2">
          <Type className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("addText")}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => activeLayerId && useEditorStore.getState().duplicateLayer(activeLayerId)} disabled={!activeLayerId} className="h-8 gap-2 hidden md:flex">
          <Copy className="h-4 w-4" />
          <span className="hidden lg:inline-block">Duplicate Layer</span>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Select
          value={locale}
          onValueChange={(val) => setLocale(val as Locale)}
        >
          <SelectTrigger className="w-[80px] h-8 text-xs focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">EN</SelectItem>
            <SelectItem value="fr">FR</SelectItem>
            <SelectItem value="ar">AR</SelectItem>
          </SelectContent>
        </Select>

        <div className="h-4 w-px bg-border mx-1" />
        <FacebookPreviewDialog />
        {lastSaved && (
          <div className="text-xs text-muted-foreground mr-4 hidden md:block">
            Saved {lastSaved.toLocaleTimeString()}
          </div>
        )}
        <SaveAsTemplateDialog />
        <Button variant="outline" size="sm" onClick={saveDesign} disabled={isSaving}>
          {isSaving ? t("saving") : t("save")}
        </Button>
        <Button size="sm" onClick={handleExport} disabled={!stageRef} className="export-btn-tour">
          {t("export")}
        </Button>
      </div>
    </header>
  );
}
