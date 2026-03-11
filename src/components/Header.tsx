"use client";

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
      <div className="text-xl font-semibold">
        {/* We can potentially display the current page title here */}
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
