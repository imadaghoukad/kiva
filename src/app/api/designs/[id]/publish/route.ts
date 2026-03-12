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
    const { pageId, caption } = body;

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
    // 1. We would fetch the logged-in user's Facebook Page Access Token from our DB.
    // 2. We'd convert the Konva JSON state to a server-side image (e.g. via Puppeteer, 
    //    or by having the client upload the image to R2 simultaneously and passing that URL).
    // 3. We'd call `POST /v19.0/${pageId}/photos` with `url=` and `message=caption`.

    console.log(`[FB Publish] Mock publishing design ${id} to page ${pageId} with caption: ${caption}`);

    // Update design document history
    if (!design.publishHistory) {
      design.publishHistory = [];
    }
    design.publishHistory.push({ 
      pageId, 
      publishedAt: new Date() 
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
