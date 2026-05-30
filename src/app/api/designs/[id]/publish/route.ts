import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Design from "@/models/Design";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { pageId, scheduled_publish_time } = body;

    if (scheduled_publish_time && session?.user?.plan !== 'pro') {
      return NextResponse.json({ error: "Scheduling is a Pro feature" }, { status: 403 });
    }

    await connectToDatabase();

    const design = await Design.findOne({
      _id: id,
      userId: (session.user as { id: string }).id,
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // --- FACEBOOK GRAPH API INTEGRATION (Mock / Prototype) ---
    // In a full production app:
    // ...
    // If scheduled_publish_time exists, we pass it along with published=false

    const isScheduling = !!scheduled_publish_time;
    console.log(`[FB Publish] Mock ${isScheduling ? 'scheduling' : 'publishing'} design ${id} to page ${pageId}. Scheduled time: ${scheduled_publish_time}`);

    // Update design document history
    if (!design.publishHistory) {
      design.publishHistory = [];
    }

    design.publishHistory.push({
      pageId,
      publishedAt: new Date(),
      status: isScheduling ? 'scheduled' : 'published',
      scheduledFor: isScheduling ? new Date(scheduled_publish_time * 1000) : null,
    });
    await design.save();

    return NextResponse.json({ success: true, message: "Published successfully" });
  } catch (error) {
    console.error("Facebook publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish to Facebook" },
      { status: 500 }
    );
  }
}
