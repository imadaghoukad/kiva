"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useEditorStore } from '@/store/useEditorStore';
import { ITemplate } from '@/models/Template';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TemplatePanel() {
  const [adminTemplates, setAdminTemplates] = useState<ITemplate[]>([]);
  const [myTemplates, setMyTemplates] = useState<ITemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { applyTemplate } = useEditorStore();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const [adminRes, mineRes] = await Promise.all([
          fetch('/api/templates'),
          fetch('/api/templates/mine')
        ]);

        if (adminRes.ok) {
          const data = await adminRes.json();
          setAdminTemplates(data);
        }
        if (mineRes.ok) {
          const data = await mineRes.json();
          setMyTemplates(data);
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const renderTemplateGrid = (items: ITemplate[]) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (items.length === 0) {
      return <div className="text-sm text-muted-foreground text-center mt-10">No templates found</div>;
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {items.map((template) => (
          <Card
            key={template._id as unknown as string}
            className="cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all group duration-200"
            onClick={() => applyTemplate(template)}
          >
            <div
              className="aspect-[4/3] bg-muted w-full relative group-hover:opacity-90 transition-opacity"
              style={{
                backgroundImage: template.bgImageUrl ? `url(${template.bgImageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {!template.bgImageUrl && (
                 <div className="absolute inset-0 opacity-10 flex items-center justify-center">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z" /></svg>
                 </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="text-sm font-medium leading-none">{template.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{template.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background border-e">
      <Tabs defaultValue="all" className="flex flex-col h-full w-full">
        <div className="p-4 border-b flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase text-muted-foreground px-1">Templates</h2>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Library</TabsTrigger>
            <TabsTrigger value="mine">My Templates</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <TabsContent value="all" className="p-4 m-0 border-none outline-none">
            {renderTemplateGrid(adminTemplates)}
          </TabsContent>
          <TabsContent value="mine" className="p-4 m-0 border-none outline-none">
            {renderTemplateGrid(myTemplates)}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
