'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useEditorStore } from '@/store/useEditorStore';
import { ITemplate } from '@/models/Template';

export default function TemplatePanel() {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { applyTemplate } = useEditorStore();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch('/api/templates');
        if (res.ok) {
          const data = await res.json();
          setTemplates(data);
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  return (
    <div className="flex flex-col h-full bg-background border-e">
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold uppercase text-muted-foreground">Templates</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        {loading ? (
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
        ) : templates.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center mt-10">No templates found</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <Card 
                key={template._id as unknown as string} 
                className="cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all group duration-200"
                onClick={() => applyTemplate(template)} // Will typecast later in store
              >
                <div 
                  className="aspect-[4/3] bg-muted w-full relative group-hover:opacity-90 transition-opacity"
                  style={{
                    backgroundImage: template.bgImageUrl ? `url(${template.bgImageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Fallback pattern if no image */}
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
        )}
      </ScrollArea>
    </div>
  );
}
