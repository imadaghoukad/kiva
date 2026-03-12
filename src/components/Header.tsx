"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { SidebarContent } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { User, LogOut, Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sheet when navigation happens
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Map path to a friendly name
  const pageName = pathname.split("/").filter(Boolean)[0] || "Dashboard";
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace("-", " ");

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/5 px-6 md:px-8 bg-background/30 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden transition-transform active:scale-90" />}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 bg-background/80 backdrop-blur-2xl border-r-white/10">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Access the application pages
            </SheetDescription>
            <div className="pt-6">
              <SidebarContent pathname={pathname} />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">PostCanvas</span>
          <h2 className="text-xl font-bold tracking-tight text-foreground">{formattedPageName}</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-accent rounded-full transition-all">
          <Bell className="h-5 w-5" />
        </Button>
        
        {session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 transition-transform active:scale-95" />
              }
            >
              <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm transition-all hover:border-primary">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 glass" align="end">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{session.user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <DropdownMenuItem className="p-3 rounded-xl cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors">
                <User className="mr-3 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 mx-2" />
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="p-3 rounded-xl cursor-pointer focus:bg-destructive/10 focus:text-destructive transition-colors text-destructive"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}
