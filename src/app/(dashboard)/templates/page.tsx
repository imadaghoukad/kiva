import { Search, Filter, Sparkles, Layout, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TemplatesPage() {
  const categories = ["All", "Social Media", "Posters", "Flyers", "Business Cards"];

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground">Template Library</h1>
          <p className="text-muted-foreground text-sm font-medium">Browse high-quality professionally designed templates</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
             <Input 
                placeholder="Search templates..." 
                className="pl-10 h-11 bg-background/50 border-white/10 rounded-xl focus:ring-primary/20 transition-all"
             />
          </div>
          <Button variant="outline" className="h-11 px-4 border-white/10 rounded-xl bg-background/50">
             <Filter className="h-4 w-4 mr-2" />
             Filters
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat, index) => (
          <button 
            key={cat}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              index === 0 
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                : "bg-background/50 border-white/10 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="group overflow-hidden rounded-[2rem] border-white/5 bg-background/50 backdrop-blur-xl shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 duration-500">
            <div className="relative aspect-[3/4] bg-muted/20 overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                  <ImageIcon className="h-20 w-20" />
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg mb-1">Premium Theme {i}</h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">Social Media • 1080x1080</p>
                  <Button className="w-full bg-primary hover:bg-primary shadow-xl shadow-primary/20 rounded-xl py-6 font-bold">
                     Use Template
                  </Button>
               </div>
               <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Sparkles className="h-4 w-4" />
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gradient-to-br from-primary/5 to-transparent rounded-[3rem] border border-white/5 border-dashed">
         <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
            <Layout className="h-10 w-10 text-primary" />
         </div>
         <h2 className="text-2xl font-black mb-3 italic">Custom Request?</h2>
         <p className="text-muted-foreground text-sm font-medium max-w-sm mb-8 leading-relaxed">
           Can&apos;t find what you&apos;re looking for? Reach out to our design team for a custom template tailored to your brand.
         </p>
         <Button variant="outline" className="h-12 px-8 rounded-xl border-primary/20 hover:bg-primary/5 font-bold transition-all hover:translate-y-[-2px]">
            Contact Support
         </Button>
      </div>
    </div>
  );
}
