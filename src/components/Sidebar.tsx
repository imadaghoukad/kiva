"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileImage, Settings, Sparkles, HelpCircle } from "lucide-react";

export const navLinks = [
  { name: "My Designs", href: "/designs", icon: LayoutDashboard },
  { name: "Templates", href: "/templates", icon: FileImage },
  { name: "Batch Create", href: "/batch", icon: Sparkles }, // Added for visibility
  { name: "Settings", href: "/settings", icon: Settings },
];

export function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-10 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
            PostCanvas
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1.5 px-3">
        <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Main Menu
        </p>
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
              }`}
            >
              <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              <span className="font-semibold text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 border border-primary/10">
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Need help?</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Check our guides for advanced design tips.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex h-full w-72 flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl shadow-2xl">
      <SidebarContent pathname={pathname} />
    </div>
  );
}
