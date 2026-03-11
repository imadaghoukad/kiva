"use client";

import TopToolbar from "./TopToolbar";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import dynamic from "next/dynamic";
const CanvasWorkarea = dynamic(() => import("./CanvasWorkarea"), { ssr: false });

export default function EditorLayout({ designId }: { designId: string }) {
  return (
    <div className="flex h-full w-full flex-col">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        <main className="flex-1 overflow-hidden relative bg-muted/20">
          <div className="absolute inset-0 flex items-center justify-center">
             {/* <div className="text-muted-foreground">Canvas Area Placeholder</div> */}
             <CanvasWorkarea />
          </div>
        </main>
        <RightPanel />
      </div>
    </div>
  );
}
