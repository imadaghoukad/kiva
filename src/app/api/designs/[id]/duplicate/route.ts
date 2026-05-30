import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongoose";
import Design from "@/models/Design";

export const dynamic = 'force-dynamic';

export async function POST(
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

    const originalDesign = await Design.findOne({
      _id: resolvedParams.id,
      userId: session.user.id,
    }).lean();

    if (!originalDesign) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { _id, createdAt, updatedAt, ...rest } = originalDesign as any;

    const newDesign = new Design({
      ...rest,
      name: `${originalDesign.name} (Copy)`
    });

    await newDesign.save();

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    console.error("Failed to duplicate design:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
