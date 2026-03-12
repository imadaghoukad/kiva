import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Design from "@/models/Design";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PublishDialog } from "@/components/PublishDialog";
import { Plus, MoreVertical, Layout, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="p-6 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Design Workspace</h1>
          <p className="text-muted-foreground text-sm font-medium">Manage your creative designs and assets</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-10 w-px bg-white/5 mx-2 hidden md:block" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest hidden md:block">
            {designs.length} Saved Designs
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Create New Design Card */}
        <Link 
          href="/editor/new"
          className="group relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-primary/20 bg-primary/5 p-8 transition-all hover:bg-primary/10 hover:border-primary/40 hover:scale-[1.02] active:scale-95 h-full min-h-[300px]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-transform group-hover:scale-110 mb-6">
            <Plus className="h-8 w-8 transition-transform group-hover:rotate-90 duration-500" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold">New Design</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[150px]">Start with a fresh canvas</p>
          </div>
          
          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus className="h-4 w-4 text-primary" />
          </div>
        </Link>

        {designs.map((design) => (
          <div key={design._id.toString()} className="group relative">
            <Card className="overflow-hidden rounded-[2rem] border-white/5 bg-background/50 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 duration-300">
              <Link href={`/editor/${design._id.toString()}`} className="block relative aspect-video bg-muted/20 overflow-hidden">
                <div 
                  className="w-full h-full transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                  style={{
                    backgroundColor: design.bgImageUrl ? "transparent" : "oklch(0.2 0.02 240)",
                    backgroundImage: design.bgImageUrl ? `url(${design.bgImageUrl})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <Layout className="h-3 w-3" />
                    Open Editor
                  </div>
                </div>
              </Link>
              
              <div className="p-6 bg-transparent space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 truncate">
                    <Link href={`/editor/${design._id.toString()}`}>
                      <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                        {design.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground/60 font-medium lowercase">
                      <Clock className="h-3 w-3" />
                      {new Date(design.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                   <PublishDialog designId={design._id.toString()} />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      
      {designs.length === 0 && (
         <div className="flex flex-col items-center justify-center pt-10 text-center opacity-40 py-20 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
            <Layout className="h-20 w-20 text-muted-foreground mb-6" />
            <h2 className="text-2xl font-black mb-2">Workspace Empty</h2>
            <p className="text-sm font-medium max-w-xs leading-relaxed">
              Unlock your creativity by creating your first masterpiece.
            </p>
         </div>
      )}
    </div>
  );
}
