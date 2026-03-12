import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/mongoose";
import Template from "@/models/Template";
import BatchClient from "./BatchClient";

export const dynamic = 'force-dynamic';

export default async function BatchPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  await connectToDatabase();
  
  // Fetch all templates to display in the selector
  const rawTemplates = await Template.find().sort({ createdAt: -1 }).lean();
  
  // Serialize Data for Client Component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const templates = rawTemplates.map((t: any) => ({
    ...t,
    _id: t._id.toString(),
  }));

  return (
    <div className="p-6 space-y-10 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Batch Generation</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Scale your content workflow by generating graphics across multiple templates instantly.
        </p>
      </div>
      
      <BatchClient templates={templates} />
    </div>
  );
}
