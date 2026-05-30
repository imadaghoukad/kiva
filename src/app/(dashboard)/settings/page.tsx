import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Bell, Zap } from "lucide-react";
import { UpgradeButton } from "./UpgradeButton";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Account Settings</h1>
        <p className="text-muted-foreground text-sm font-medium">Manage your PostCanvas profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden rounded-[2rem] border-white/5 bg-background/50 backdrop-blur-xl shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-white/5 p-8">
              <div className="flex items-center gap-3 mb-1">
                 <User className="h-5 w-5 text-primary" />
                 <CardTitle className="text-xl font-bold">Profile Identity</CardTitle>
              </div>
              <CardDescription className="text-sm font-medium">
                Publicly visible information associated with your PostCanvas account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Full Name</label>
                  <div className="flex items-center h-12 px-4 rounded-xl bg-muted/30 border border-white/5 text-sm font-bold">
                    {session.user.name || "Anonymous User"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Address</label>
                  <div className="flex items-center h-12 px-4 rounded-xl bg-muted/30 border border-white/5 text-sm font-bold overflow-hidden truncate">
                    {session.user.email}
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                 <Button className="rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]">
                   Edit Profile
                 </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[2rem] border-white/5 bg-background/50 backdrop-blur-xl shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-white/5 p-8">
              <div className="flex items-center gap-3 mb-1">
                 <Shield className="h-5 w-5 text-primary" />
                 <CardTitle className="text-xl font-bold">Security & Privacy</CardTitle>
              </div>
              <CardDescription className="text-sm font-medium">
                Control your data and account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
               <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-white/5 mb-4 group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="h-5 w-5" />
                     </div>
                     <div>
                        <p className="text-sm font-bold">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                     </div>
                  </div>
                  <Button variant="ghost" className="rounded-lg font-bold text-xs">Enable</Button>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="overflow-hidden rounded-[2rem] border-white/5 bg-primary/5 backdrop-blur-xl shadow-xl border-dashed border-2">
             <CardHeader className="p-8">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                   <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-black italic">Pro Plan</CardTitle>
                <CardDescription className="text-sm font-medium leading-relaxed">
                   Unlock unlimited batch generation and custom cloud templates.
                </CardDescription>
             </CardHeader>
             <CardContent className="p-8 pt-0">
                <UpgradeButton />
             </CardContent>
           </Card>
           
           <div className="p-8 rounded-[2rem] border border-white/5 bg-background/30 text-center">
              <Bell className="h-6 w-6 mx-auto mb-4 text-muted-foreground/40" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Notifications</p>
           </div>
        </div>
      </div>
    </div>
  );
}
