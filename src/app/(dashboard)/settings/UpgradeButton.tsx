"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function UpgradeButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const isPro = session?.user?.plan === 'pro';

  const handleUpgrade = async () => {
    setLoading(true);
    // Mock checkout delay
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      const res = await fetch("/api/user/upgrade", { method: "POST" });
      if (!res.ok) throw new Error("Failed to upgrade");
      
      await update({ plan: 'pro' }); // Force session update
      toast.success("Successfully upgraded to Pro Plan!");
      router.refresh();
    } catch {
      toast.error("Could not process upgrade");
    } finally {
      setLoading(false);
    }
  };

  if (isPro) {
    return (
      <Button disabled className="w-full h-12 rounded-xl font-black tracking-tight" variant="outline">
        Active Plan (Pro)
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleUpgrade} 
      disabled={loading}
      className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black tracking-tight"
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {loading ? "Processing..." : "Upgrade Now ($15/mo)"}
    </Button>
  );
}
