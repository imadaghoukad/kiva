"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DuplicateDesignButton({ designId }: { designId: string }) {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const router = useRouter();

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/designs/${designId}/duplicate`, {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Design duplicated successfully");
        router.refresh();
      } else {
        toast.error("Failed to duplicate design");
      }
    } catch {
      toast.error("An error occurred while duplicating");
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDuplicate} 
      disabled={isDuplicating}
      className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors"
      title="Duplicate Design"
    >
      {isDuplicating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
