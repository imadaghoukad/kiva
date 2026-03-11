"use client";

export default function RightPanel() {
  return (
    <aside className="w-72 border-l bg-background flex flex-col">
      <div className="h-14 border-b flex items-center px-4 font-semibold shrink-0">
        Properties
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Placeholder for properties */}
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="h-10 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-10 rounded bg-muted animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
