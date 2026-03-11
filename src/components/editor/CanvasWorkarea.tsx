"use client";

import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Rect, Text, Transformer } from "react-konva";
import useImage from "use-image";
import { useEditorStore } from "@/store/useEditorStore";
import Konva from "konva";
import { useLocaleStore } from "@/store/useLocaleStore";

export default function CanvasWorkarea() {
  const { dir } = useLocaleStore();
  const setStageRef = useEditorStore((state) => state.setStageRef);

  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stageRef = useRef<any>(null);
  const trRef = useRef<Konva.Transformer>(null);
  
  // Expose the stage reference to the store so the toolbar can export it
  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef.current);
    }
  }, [setStageRef]);
  
  const [scale, setScale] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    canvasSize,
    bgImageUrl,
    setBgImageUrl,
    layers,
    activeLayerId,
    setActiveLayerId,
    updateTextLayer,
  } = useEditorStore();

  const [bgImage] = useImage(bgImageUrl || "", "anonymous");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const padding = 60;
      const cw = container.clientWidth - padding * 2;
      const ch = container.clientHeight - padding * 2;

      const scaleX = cw / canvasSize.width;
      const scaleY = ch / canvasSize.height;
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [canvasSize]);

  // Attach transformer
  useEffect(() => {
    if (activeLayerId && trRef.current && stageRef.current) {
      const activeNode = stageRef.current.findOne(`#${activeLayerId}`);
      if (activeNode) {
        trRef.current.nodes([activeNode]);
        trRef.current.getLayer()?.batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [activeLayerId, layers]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setBgImageUrl(URL.createObjectURL(file));
      }
    }
  };

  const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === "bgRect" || e.target.name() === "bgImage";
    if (clickedOnEmpty) {
      setActiveLayerId(null);
      setEditingId(null);
    }
  };

  const handleTextDblClick = (layerId: string) => {
    setEditingId(layerId);
    setActiveLayerId(layerId);
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className="relative shadow-lg bg-white"
        style={{
          width: canvasSize.width * scale,
          height: canvasSize.height * scale,
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          scale={{ x: scale, y: scale }}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            <Rect name="bgRect" x={0} y={0} width={canvasSize.width} height={canvasSize.height} fill="#ffffff" />
            
            {bgImage && (
              <KonvaImage name="bgImage" image={bgImage} width={canvasSize.width} height={canvasSize.height} />
            )}
            
            {!bgImage && (
              <Text 
                name="bgText" text="Drag & Drop Background Image"
                x={0} y={canvasSize.height / 2} width={canvasSize.width} align="center"
                fontSize={24} fill="#aaa" listening={false}
              />
            )}
            
            {layers.map((layer) => {
              // Handle CSS text-transform via JS before it hits Konva
              let displayText = layer.text;
              if (layer.textTransform === "uppercase") displayText = displayText.toUpperCase();
              else if (layer.textTransform === "lowercase") displayText = displayText.toLowerCase();
              else if (layer.textTransform === "capitalize") displayText = displayText.replace(/\b\w/g, c => c.toUpperCase());

              const isEditing = editingId === layer.id;

              return (
                <React.Fragment key={layer.id}>
                  <Text
                    id={layer.id}
                    text={displayText}
                    x={layer.x}
                    y={layer.y}
                    fontSize={layer.fontSize}
                    fontFamily={layer.fontFamily}
                    fontStyle={layer.fontWeight}
                    fill={layer.fill}
                    rotation={layer.rotation}
                    align={layer.align}
                    direction={dir}
                    letterSpacing={layer.letterSpacing}
                    lineHeight={layer.lineHeight}
                    draggable={!layer.locked && layer.visible && !isEditing}
                    visible={layer.visible && !isEditing}
                    onClick={() => {
                      if (!layer.locked && layer.visible) setActiveLayerId(layer.id);
                    }}
                    onTap={() => {
                      if (!layer.locked && layer.visible) setActiveLayerId(layer.id);
                    }}
                    onDblClick={() => {
                      if (!layer.locked && layer.visible) handleTextDblClick(layer.id);
                    }}
                    onDblTap={() => {
                      if (!layer.locked && layer.visible) handleTextDblClick(layer.id);
                    }}
                    onDragEnd={(e) => {
                      updateTextLayer(layer.id, { x: e.target.x(), y: e.target.y() });
                    }}
                    onTransformEnd={(e) => {
                      const node = e.target;
                      const scaleY = node.scaleY();
                      
                      node.scaleX(1);
                      node.scaleY(1);
                      
                      updateTextLayer(layer.id, {
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        fontSize: Math.max(5, layer.fontSize * scaleY),
                      });
                    }}
                  />
                </React.Fragment>
              );
            })}

            <Transformer 
              ref={trRef} 
              boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 || newBox.height < 10 ? oldBox : newBox)}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            />
          </Layer>
        </Stage>

        {/* HTML Input Overlay for Text Editing */}
        {editingId && (() => {
          const layer = layers.find(l => l.id === editingId);
          if (!layer) return null;
          
          return (
            <textarea
              autoFocus
              defaultValue={layer.text}
              dir={dir}
              onChange={(e) => updateTextLayer(layer.id, { text: e.target.value })}
              onBlur={() => setEditingId(null)}
              style={{
                position: "absolute",
                top: layer.y * scale,
                left: layer.x * scale,
                width: `${Math.max(100, (layer.fontSize * 0.6 * layer.text.length + 50)) * scale}px`,
                height: `${layer.fontSize * layer.lineHeight * scale}px`,
                fontSize: `${layer.fontSize * scale}px`,
                border: "1px dashed #0099ff",
                padding: "0px",
                margin: "0px",
                background: "transparent",
                outline: "none",
                resize: "none",
                color: layer.fill,
                fontFamily: layer.fontFamily,
                fontWeight: layer.fontWeight.includes("bold") ? "bold" : "normal",
                fontStyle: layer.fontWeight.includes("italic") ? "italic" : "normal",
                textAlign: layer.align,
                direction: dir,
                lineHeight: layer.lineHeight,
                letterSpacing: `${layer.letterSpacing * scale}px`,
                textTransform: layer.textTransform === "none" ? "none" : layer.textTransform as "none" | "capitalize" | "uppercase" | "lowercase",
                transform: `rotate(${layer.rotation}deg)`,
                transformOrigin: "top left",
                overflow: "hidden"
              }}
            />
          );
        })()}
      </div>
    </div>
  );
}
