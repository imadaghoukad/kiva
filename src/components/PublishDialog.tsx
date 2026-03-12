"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PublishDialogProps {
  designId: string;
}

export function PublishDialog({ designId }: PublishDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [caption, setCaption] = useState("");
  const [pageId, setPageId] = useState("timeline"); // 'timeline' or specific page ID
  const [successMode, setSuccessMode] = useState(false);
  
  // In a real implementation, we'd fetch these from our FB OAuth token
  const availablePages = [
    { id: "timeline", name: "My Personal Timeline" },
    { id: "page_123", name: "Acme Corp Page" },
    { id: "page_456", name: "Design Community Group" }
  ];

  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const res = await fetch(`/api/designs/${designId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, caption }),
      });

      if (!res.ok) {
        throw new Error("Failed to publish design");
      }

      setSuccessMode(true);
      toast.success("Successfully published to Facebook!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };

  const resetAndClose = () => {
    setOpen(false);
    setTimeout(() => {
      setSuccessMode(false);
      setCaption("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) resetAndClose();
      else setOpen(val);
    }}>
      <DialogTrigger>
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Share className="h-4 w-4 mr-1.5" />
          Publish
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
        {successMode ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center">Published Successfully</DialogTitle>
              <DialogDescription className="text-center">
                Your design has been posted to Facebook.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={resetAndClose} className="mt-4">Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Publish to Facebook</DialogTitle>
              <DialogDescription>
                Share your design directly to your timeline or a page you manage.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Post Destination</label>
                <Select value={pageId} onValueChange={(val) => val && setPageId(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select where to post" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Caption (Optional)</label>
                <Textarea 
                  placeholder="Write something about this design..." 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="resize-none h-24"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={resetAndClose} disabled={isPublishing}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={isPublishing} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Share className="mr-2 h-4 w-4" />
                    Share Now
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
