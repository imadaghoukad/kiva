"use client";

export default function LeftPanel() {
  return (
    <aside className="w-80 border-r bg-background flex flex-col">
      <div className="h-14 border-b flex items-center px-4 font-semibold shrink-0">
        Templates
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placeholder for templates list */}
        <div className="h-32 rounded bg-muted animate-pulse" />
        <div className="h-32 rounded bg-muted animate-pulse" />
        <div className="h-32 rounded bg-muted animate-pulse" />
      </div>
    </aside>
  );
}
