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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batch Generation</h1>
          <p className="text-muted-foreground mt-1">
            Write your text once and generate graphics across multiple templates instantly.
          </p>
        </div>
      </div>
      
      <BatchClient templates={templates} />
    </div>
  );
}
