"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, 
  Edit, 
  Globe, 
  Lock, 
  Loader2,
  MoreVertical,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Template {
  _id: string;
  name: string;
  category: string;
  canvasSize: { width: number; height: number };
  isPublic: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function MyTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/templates/mine");
      if (!res.ok) throw new Error("Failed to load templates");
      const data = await res.json();
      setTemplates(data);
    } catch {
      toast.error("Could not load your templates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTemplates((prev) => prev.filter((t) => t._id !== id));
      toast.success("Template deleted");
    } catch {
      toast.error("Failed to delete template");
    }
  };

  const handleToggleVisibility = async (id: string, currentPublic: boolean) => {
    try {
      const res = await fetch(`/api/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !currentPublic }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTemplates((prev) => prev.map((t) => (t._id === id ? updated : t)));
      toast.success(updated.isPublic ? "Template made public (pending approval)" : "Template made private");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground">My Templates</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage your custom created templates</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center p-20 border border-dashed rounded-[2rem] bg-muted/20">
          <p className="text-muted-foreground mb-4">You haven&apos;t created any templates yet.</p>
          <Button onClick={() => window.location.href='/editor/new'}>Create a Design</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {templates.map((template) => (
            <Card key={template._id} className="group overflow-hidden rounded-[2rem] border-white/5 bg-background/50 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl duration-500">
              <div className="relative aspect-[3/4] bg-muted/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <ImageIcon className="h-16 w-16" />
                </div>
                
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {template.isPublic ? (
                    <div className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                      <Globe className="w-3 h-3" /> Public {template.moderationStatus === 'pending' && '(Pending)'}
                    </div>
                  ) : (
                    <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                      <Lock className="w-3 h-3" /> Private
                    </div>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-md border-0" />
                      }
                    >
                        <MoreVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleVisibility(template._id, template.isPublic)}>
                        {template.isPublic ? "Make Private" : "Make Public"}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(template._id)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                  <h3 className="text-white font-bold text-lg mb-1 truncate">{template.name}</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">
                    {template.category} • {template.canvasSize?.width}x{template.canvasSize?.height}
                  </p>
                  <Button 
                    variant="default" 
                    className="w-full bg-primary hover:bg-primary/90 font-bold"
                    onClick={() => window.location.href = `/editor/new?templateId=${template._id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Use
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
