import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Design from "@/models/Design";
import Link from "next/link";
import { PlusCircle, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function DesignsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !(session.user as { id?: string }).id) {
    redirect("/login");
  }

  await connectToDatabase();
  
  const designs = await Design.find({ userId: (session.user as { id: string }).id })
    .sort({ updatedAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Designs</h1>
        <Link 
          href="/editor/new"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
        >
          <PlusCircle className="me-2 h-4 w-4" />
          Create Design
        </Link>
      </div>
      
      {designs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/10 border-dashed">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">No designs yet</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            You don&apos;t have any saved designs. Start creating beautiful graphics today.
          </p>
          <Link 
            href="/editor/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
          >
            Create Your First Design
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {designs.map((design) => (
            <Link key={design._id.toString()} href={`/editor/${design._id.toString()}`} className="group">
              <Card className="overflow-hidden border-muted transition-all hover:border-primary hover:shadow-md">
                <div 
                  className="w-full aspect-video bg-muted/30 relative flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: design.bgImageUrl ? "transparent" : "#f1f5f9",
                    backgroundImage: design.bgImageUrl ? `url(${design.bgImageUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  {!design.bgImageUrl && (
                    <span className="text-muted-foreground font-semibold opacity-30 text-xs uppercase px-4 text-center">
                      ({design.canvasSize.width}x{design.canvasSize.height})
                    </span>
                  )}
                </div>
                <div className="p-4 bg-background">
                  <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                    {design.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Updated {new Date(design.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
