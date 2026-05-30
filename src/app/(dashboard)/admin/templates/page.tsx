import connectToDatabase from "@/lib/mongoose";
import Template from "@/models/Template";
import { AdminModerationClient } from "./AdminModerationClient";
import type { ModerationTemplate } from "./AdminModerationClient";

export const dynamic = 'force-dynamic';

export default async function AdminTemplatesPage() {
  await connectToDatabase();
  
  // Fetch pending or reported templates
  const templates = await Template.find({
    $or: [
      { moderationStatus: 'pending' },
      { reported: true }
    ]
  }).sort({ createdAt: -1 }).lean();

  // Convert ObjectIds to strings for passing to client component
  const serializedTemplates: ModerationTemplate[] = templates.map((template) => ({
    _id: template._id.toString(),
    name: template.name,
    bgImageUrl: template.bgImageUrl,
    reported: template.reported,
    moderationStatus: template.moderationStatus,
    authorName: template.authorName,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Moderation Queue</h1>
        <p className="text-muted-foreground text-sm font-medium">Review pending public templates and user reports.</p>
      </div>
      
      <AdminModerationClient initialTemplates={serializedTemplates} />
    </div>
  );
}
