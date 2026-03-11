"use client";

import TopToolbar from "./TopToolbar";
import LayerList from "./LayerList";
import RightPanel from "./RightPanel";
import TemplatePanel from './TemplatePanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, LayoutTemplate } from 'lucide-react';
import dynamic from "next/dynamic";
const CanvasWorkarea = dynamic(() => import("./CanvasWorkarea"), { ssr: false });

export default function EditorLayout() {
  return (
    <div className="flex h-full w-full flex-col">
      <TopToolbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r bg-background flex flex-col">
          <Tabs defaultValue="templates" className="flex-1 flex flex-col">
            <div className="border-b px-4 py-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="templates">
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Templates
                </TabsTrigger>
                <TabsTrigger value="layers">
                  <Layers className="w-4 h-4 mr-2" />
                  Layers
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="templates" className="flex-1 mt-0 data-[state=active]:flex flex-col border-none p-0 outline-none">
              <TemplatePanel />
            </TabsContent>
            
            <TabsContent value="layers" className="flex-1 mt-0 data-[state=active]:flex flex-col border-none p-0 outline-none">
              <LayerList />
            </TabsContent>
          </Tabs>
        </div>
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
