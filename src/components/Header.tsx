"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sheet when navigation happens
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-4 bg-muted/40">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Access the application pages
            </SheetDescription>
            <SidebarContent pathname={pathname} />
          </SheetContent>
        </Sheet>
        <div className="text-xl font-semibold hidden md:block">
          {/* We can potentially display the current page title here */}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {session?.user ? (
          <>
            <span className="text-sm text-muted-foreground">
              {session.user.name || session.user.email}
            </span>
            <Button variant="outline" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : null}
      </div>
    </header>
  );
}
