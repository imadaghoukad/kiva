"use client";

import { useEffect, useRef } from "react";
import Konva from "konva";

interface RenderEngineProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templates: any[];
  // keyed by zone "text" (the placeholder label), value = user input string
  textInputs: Record<string, string>;
  onComplete: (results: { dataUrl: string; templateName: string }[]) => void;
}

export function BatchRenderEngine({ templates, textInputs, onComplete }: RenderEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || templates.length === 0) return;

    const generateImages = async () => {
      const results: { dataUrl: string; templateName: string }[] = [];

      for (const template of templates) {
        const width: number = template.canvasSize?.width ?? 1200;
        const height: number = template.canvasSize?.height ?? 630;

        // Create an off-screen stage
        const stage = new Konva.Stage({
          container: containerRef.current!,
          width,
          height,
        });

        const layer = new Konva.Layer();
        stage.add(layer);

        // Render Background
        if (template.bgImageUrl) {
          await new Promise<void>((resolve) => {
            const imageObj = new window.Image();
            imageObj.crossOrigin = "Anonymous";
            imageObj.onload = () => {
              const bgImage = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: stage.width(),
                height: stage.height(),
              });
              layer.add(bgImage);
              resolve();
            };
            imageObj.onerror = () => resolve(); // continue even if bg image fails
            imageObj.src = template.bgImageUrl;
          });
        } else {
          const bgRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: stage.width(),
            height: stage.height(),
            fill: "#ffffff",
          });
          layer.add(bgRect);
        }

        // Render textZones, injecting user inputs by matching on the zone's default text label
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (template.textZones ?? []).forEach((zone: any) => {
          // User input is keyed by the zone's original text (used as the display label)
          const userValue = textInputs[zone.text];
          const displayText = (userValue !== undefined && userValue.trim() !== "") ? userValue : zone.text;

          const konvaText = new Konva.Text({
            x: zone.x,
            y: zone.y,
            text: displayText,
            fontSize: zone.fontSize,
            fontFamily: zone.fontFamily,
            fontStyle: zone.fontWeight,
            fill: zone.fill,
            rotation: zone.rotation ?? 0,
            align: zone.align ?? "left",
            letterSpacing: zone.letterSpacing ?? 0,
            lineHeight: zone.lineHeight ?? 1,
          });
          layer.add(konvaText);
        });

        layer.draw();

        const dataUrl = stage.toDataURL({ pixelRatio: 2 });
        results.push({ dataUrl, templateName: template.name });

        stage.destroy();
      }

      onComplete(results);
    };

    generateImages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, textInputs]);

  // Hidden off-screen div for Konva to mount onto temporarily
  return <div ref={containerRef} style={{ position: "fixed", top: "-9999px", left: "-9999px", opacity: 0 }} />;
}
