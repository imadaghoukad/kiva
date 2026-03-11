"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileImage, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "My Designs", href: "/designs", icon: LayoutDashboard },
    { name: "Templates", href: "/templates", icon: FileImage },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/40 px-3 py-4">
      <div className="mb-8 px-4 text-2xl font-bold tracking-tight text-primary">
        PostCanvas
      </div>
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
                isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
