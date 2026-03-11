import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Design from "@/models/Design";

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    await connectToDatabase();

    const design = await Design.findOne({
      _id: resolvedParams.id,
      userId: session.user.id,
    }).lean();

    if (!design) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }

    return NextResponse.json(design, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch design:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const { name, canvasSize, bgImageUrl, layers } = body;

    await connectToDatabase();

    const design = await Design.findOne({
      _id: resolvedParams.id,
      userId: session.user.id,
    });

    if (!design) {
      return NextResponse.json({ message: "Design not found or unauthorized" }, { status: 404 });
    }

    if (name) design.name = name;
    if (canvasSize) design.canvasSize = canvasSize;
    if (bgImageUrl !== undefined) design.bgImageUrl = bgImageUrl;
    if (layers) design.layers = layers;

    await design.save();

    return NextResponse.json(design, { status: 200 });
  } catch (error) {
    console.error("Failed to update design:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
