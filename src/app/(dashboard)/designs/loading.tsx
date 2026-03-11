import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DesignsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-36" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full bg-card">
            <div className="w-full aspect-video bg-muted/50 relative overflow-hidden flex items-center justify-center border-b p-4">
              <Skeleton className="w-full h-full" />
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center justify-between pt-4 mt-auto">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
