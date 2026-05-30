import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Design from "@/models/Design";
import Template from "@/models/Template";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch all designs for the authed user, sorted newest first
    const designs = await Design.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(designs, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch designs:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, canvasSize, bgImageUrl, layers, templateId } = body;

    // Validate request
    if (!name || !canvasSize?.width || !canvasSize?.height) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    if (session.user.plan !== 'pro') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const count = await Design.countDocuments({
        userId: session.user.id,
        createdAt: { $gte: startOfMonth }
      });

      if (count >= 10) {
        return NextResponse.json(
          { message: "Free plan limit reached (10 designs/month). Upgrade to Pro to create more designs." },
          { status: 403 }
        );
      }
    }

    const newDesign = await Design.create({
      userId: session.user.id,
      name,
      canvasSize,
      bgImageUrl: bgImageUrl || "",
      layers: layers || [],
    });

    if (templateId) {
      await Template.findByIdAndUpdate(templateId, {
        $inc: { usageCount: 1 }
      });
    }

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Failed to create design:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
