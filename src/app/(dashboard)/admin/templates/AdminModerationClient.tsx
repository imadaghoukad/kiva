"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Check, X, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ModerationTemplate {
  _id: string;
  name: string;
  bgImageUrl?: string | null;
  reported?: boolean;
  moderationStatus?: "pending" | "approved" | "rejected";
  authorName?: string | null;
}

type ModerationAction = "approve" | "reject" | "clear_report" | "delete";

export function AdminModerationClient({ initialTemplates }: { initialTemplates: ModerationTemplate[] }) {
  const [templates, setTemplates] = useState<ModerationTemplate[]>(initialTemplates);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (id: string, action: ModerationAction) => {
    setLoadingId(id);
    try {
      if (action === 'delete') {
        const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete");
        setTemplates(docs => docs.filter(t => t._id !== id));
        toast.success("Template deleted entirely.");
      } else {
        const res = await fetch(`/api/admin/templates/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action })
        });
        if (!res.ok) throw new Error("Action failed");
        
        // Remove from queue because it's no longer pending/reported
        setTemplates(docs => docs.filter(t => t._id !== id));
        toast.success(`Template ${action}d successfully.`);
      }
    } catch {
      toast.error("Operation failed.");
    } finally {
      setLoadingId(null);
    }
  };

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border border-white/5 border-dashed rounded-[2rem]">
        <ShieldAlert className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-xl font-bold">Queue is empty</h3>
        <p className="text-muted-foreground text-sm">No templates require moderation right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map(t => (
        <Card key={t._id} className="overflow-hidden rounded-[2rem] border border-white/5 bg-background shadow-lg">
          <div 
            className="aspect-[4/3] w-full bg-muted relative border-b border-white/5"
            style={{
              backgroundImage: t.bgImageUrl ? `url(${t.bgImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
             <div className="absolute top-3 left-3 flex flex-col gap-2">
               {t.reported && <Badge variant="destructive" className="shadow-lg">Reported</Badge>}
               {t.moderationStatus === 'pending' && <Badge variant="secondary" className="shadow-lg backdrop-blur-md bg-background/50">Pending Review</Badge>}
             </div>
             
             <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
               <Button variant="secondary" size="sm" onClick={() => router.push(`/editor?templateId=${t._id}`)}>
                 <Eye className="w-4 h-4 mr-2" /> Inspect
               </Button>
             </div>
          </div>
          
          <CardContent className="p-5">
            <h3 className="text-base font-bold truncate mb-1">{t.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">By {t.authorName || 'Anonymous'}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Button 
                size="sm" 
                variant="default" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleAction(t._id, t.reported ? 'clear_report' : 'approve')}
                disabled={loadingId === t._id}
              >
                <Check className="w-4 h-4 mr-1" /> {t.reported ? 'Clear Flag' : 'Approve'}
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="w-full"
                onClick={() => handleAction(t._id, 'reject')}
                disabled={loadingId === t._id}
              >
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
            
            <Button 
              size="sm" 
              variant="destructive" 
              className="w-full"
              onClick={() => handleAction(t._id, 'delete')}
              disabled={loadingId === t._id}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete Permanently
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
