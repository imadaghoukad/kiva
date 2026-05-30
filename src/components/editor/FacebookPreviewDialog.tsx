"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ThumbsUp, MessageSquare, Share2, MoreHorizontal, Globe } from "lucide-react";
import { useEditorStore } from "@/store/useEditorStore";
import Image from "next/image";

export function FacebookPreviewDialog() {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const stageRef = useEditorStore((state) => state.stageRef);
  const designName = useEditorStore((state) => state.designName);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && stageRef) {
      // Temporarily hide selection handles
      const oldActiveId = useEditorStore.getState().activeLayerId;
      useEditorStore.getState().setActiveLayerId(null);
      
      setTimeout(() => {
        const dataUrl = stageRef.toDataURL({ pixelRatio: 1, mimeType: "image/jpeg", quality: 0.95 });
        setPreviewUrl(dataUrl);
        
        // Restore
        if (oldActiveId) useEditorStore.getState().setActiveLayerId(oldActiveId);
      }, 50);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-2 hidden md:flex" title="Preview Facebook Post">
        <Eye className="h-4 w-4" />
        <span className="hidden lg:inline-block">Preview</span>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white dark:bg-[#242526] border-none shadow-2xl">
        <div className="flex flex-col w-full h-full max-h-[85vh] overflow-y-auto">
          {/* Facebook Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-black/5">
                <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Brand" alt="Avatar" width={40} height={40} />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#050505] dark:text-[#e4e6eb] leading-tight">Your Brand Page</span>
                <div className="flex items-center gap-1 text-[13px] text-[#65676b] dark:text-[#b0b3b8]">
                  <span>Sponsored</span>
                  <span>·</span>
                  <Globe className="h-[10px] w-[10px]" />
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#65676b] dark:text-[#b0b3b8] hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Post Text */}
          <div className="px-4 pb-3 text-[15px] text-[#050505] dark:text-[#e4e6eb] whitespace-pre-wrap">
            Check out our latest post design: &quot;{designName || "Untitled"}&quot;. Crafted perfectly for your Facebook audience! ✨🚀
          </div>

          {/* Image Attached */}
          {previewUrl && (
            <div className="w-full relative bg-[#f0f2f5] dark:bg-[#18191a]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Post Preview" className="w-full h-auto object-cover max-h-[500px]" />
            </div>
          )}

          {/* Social Stats & Buttons */}
          <div className="flex flex-col px-4 pt-3 pb-1">
            <div className="flex items-center justify-between text-[#65676b] dark:text-[#b0b3b8] text-[13px] pb-2 border-b border-[#ced0d4] dark:border-[#3e4042]">
               <div className="flex items-center gap-1">
                  <div className="h-4 w-4 bg-[#1877f2] rounded-full flex items-center justify-center"><ThumbsUp className="h-2.5 w-2.5 text-white" /></div>
                  <div className="h-4 w-4 bg-[#f02849] rounded-full flex items-center justify-center -ml-1"><span className="text-[10px] text-white">❤️</span></div>
                  <span className="ml-1">4.2K</span>
               </div>
               <div className="flex gap-3">
                  <span>128 Comments</span>
                  <span>45 Shares</span>
               </div>
            </div>
            <div className="flex items-center justify-between py-1 mt-1">
              <Button variant="ghost" className="flex-1 text-[#65676b] dark:text-[#b0b3b8] hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-[15px] font-semibold gap-2 h-8">
                <ThumbsUp className="h-5 w-5" /> Like
              </Button>
              <Button variant="ghost" className="flex-1 text-[#65676b] dark:text-[#b0b3b8] hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-[15px] font-semibold gap-2 h-8">
                <MessageSquare className="h-5 w-5" /> Comment
              </Button>
              <Button variant="ghost" className="flex-1 text-[#65676b] dark:text-[#b0b3b8] hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-[15px] font-semibold gap-2 h-8">
                <Share2 className="h-5 w-5" /> Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
