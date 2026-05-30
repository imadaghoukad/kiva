"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share, Loader2, CheckCircle2, Calendar, Lock } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface PublishDialogProps {
  designId: string;
}

export function PublishDialog({ designId }: PublishDialogProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [caption, setCaption] = useState("");
  const [pageId, setPageId] = useState("timeline"); // 'timeline' or specific page ID
  const [successMode, setSuccessMode] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");

  // In a real implementation, we'd fetch these from our FB OAuth token
  const availablePages = [
    { id: "timeline", name: "My Personal Timeline" },
    { id: "page_123", name: "Acme Corp Page" },
    { id: "page_456", name: "Design Community Group" }
  ];

  const isFreePlan = session?.user?.plan !== 'pro';

  const handlePublish = async () => {
    if (isScheduled && !scheduleTime) {
      toast.error("Please select a date and time for scheduling.");
      return;
    }

    if (isScheduled && isFreePlan) {
      toast.error("Scheduling is a Pro feature.");
      return;
    }

    setIsPublishing(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const payload: {
        pageId: string;
        caption: string;
        scheduled_publish_time?: number;
        published?: boolean;
      } = { pageId, caption };
      if (isScheduled) {
        payload.scheduled_publish_time = Math.floor(new Date(scheduleTime).getTime() / 1000);
        payload.published = false;
      }

      const res = await fetch(`/api/designs/${designId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to publish design");
      }

      setSuccessMode(true);
      toast.success(isScheduled ? "Successfully scheduled to Facebook!" : "Successfully published to Facebook!");
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
      setIsScheduled(false);
      setScheduleTime("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) resetAndClose();
      else setOpen(val);
    }}>
      <DialogTrigger className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-8 px-3 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80">
        <Share className="h-4 w-4 mr-1.5" />
        Publish
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
        {successMode ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center">
                {isScheduled ? "Scheduled Successfully" : "Published Successfully"}
              </DialogTitle>
              <DialogDescription className="text-center">
                Your design has been {isScheduled ? 'scheduled to be posted' : 'posted'} to Facebook.
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

              <div className="space-y-3 pt-2 border-t mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Schedule for later</label>
                  </div>
                  <div className="flex items-center gap-2">
                    {isFreePlan && (
                       <span className="text-xs bg-muted px-2 py-1 flex items-center gap-1 rounded font-medium text-muted-foreground">
                         <Lock className="w-3 h-3"/> Pro
                       </span>
                    )}
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={isScheduled}
                      onChange={(e) => {
                        if (isFreePlan) {
                           toast.error("Upgrade to Pro to schedule posts!");
                           return;
                        }
                        setIsScheduled(e.target.checked);
                      }}
                    />
                  </div>
                </div>

                {isScheduled && !isFreePlan && (
                  <div className="pl-6 animate-in slide-in-from-top-2">
                    <input
                      type="datetime-local"
                      className="w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      min={new Date(Date.now() + 10 * 60000).toISOString().slice(0, 16)} // FB requires at least 10 mins
                    />
                    <p className="text-xs text-muted-foreground mt-1">Facebook requires scheduling at least 10 minutes in advance.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={resetAndClose} disabled={isPublishing}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={isPublishing} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isScheduled ? "Scheduling..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    {isScheduled ? <Calendar className="mr-2 h-4 w-4" /> : <Share className="mr-2 h-4 w-4" />}
                    {isScheduled ? "Schedule Post" : "Share Now"}
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
