import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account profile and platform preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            These are the details associated with your Canva Plus account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <span className="text-sm font-medium leading-none">Name</span>
            <span className="text-sm text-muted-foreground">{session.user.name || "N/A"}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-sm font-medium leading-none">Email Address</span>
            <span className="text-sm text-muted-foreground">{session.user.email}</span>
          </div>
          <div className="grid gap-1 pt-4">
             <Button variant="outline" className="w-fit">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
